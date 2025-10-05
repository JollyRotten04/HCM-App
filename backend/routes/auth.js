import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import admin from "firebase-admin"; // needed for FieldValue
import db from "../firestore.js";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Fetch user from Firestore
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = userSnap.data();

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { email: user.email, role: user.role, userId: user.userId, firstName: user.firstName, lastName: user.lastName }, // include userId in token
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // persist for 7 days
    );

    res.json({ token, isAdmin: user.role === "admin", userId: user.userId, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, retypePassword, role, schedule } = req.body;

    if (!firstName || !lastName || !email || !password || !retypePassword || !role || !schedule) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== retypePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate userId
    const rolePrefix = role.toLowerCase() === "admin" ? "Admin" : "Employee";

    // Fetch all users with this role
    const usersWithRoleSnap = await db.collection("users").where("role", "==", role).get();

    // Extract numbers from existing userIds and find the max
    let maxNumber = 100; // start from 101
    usersWithRoleSnap.forEach(doc => {
      const data = doc.data();
      const match = data.userId?.match(/\d+$/); // extract number at the end
      if (match) {
        const num = parseInt(match[0]);
        if (num > maxNumber) maxNumber = num;
      }
    });

    const userId = `${rolePrefix}-${maxNumber + 1}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // detect user's timezone

    await userRef.set({
      userId,
      firstName,
      lastName,
      email,
      role,
      timezone,
      password: hashedPassword,
      schedule, // e.g., { start: '09:00', end: '18:00' }
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, isAdmin: role === "admin", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only admin can fetch all users
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const snap = await db.collection("users").get();
    let users = snap.docs.map(doc => {
      const data = doc.data();
      delete data.password; // 🚨 don’t expose hashed passwords
      return { id: doc.id, ...data };
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get employee work hour statistics (admin only)
router.get("/employee-stats", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    const { date, period = 'daily' } = req.query; // period: 'daily', 'weekly', 'monthly'
    const targetDate = date || new Date().toLocaleDateString("en-CA");
    const dateObj = new Date(targetDate);
    if (isNaN(dateObj)) return res.status(400).json({ message: "Invalid target date" });

    // Calculate date range
    let startDate, endDate, dateRange;
    if (period === 'weekly') {
      const dayOfWeek = dateObj.getDay(); // Sunday = 0
      startDate = new Date(dateObj); startDate.setDate(dateObj.getDate() - dayOfWeek);
      endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 6);
    } else if (period === 'monthly') {
      startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
      endDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    } else {
      startDate = dateObj;
      endDate = dateObj;
    }

    dateRange = `${startDate.toLocaleDateString("en-CA")} to ${endDate.toLocaleDateString("en-CA")}`;

    const startDateStr = startDate.toLocaleDateString("en-CA");
    const endDateStr = endDate.toLocaleDateString("en-CA");

    // Fetch users
    const usersSnap = await db.collection("users").get();
    const users = {};
    usersSnap.forEach(doc => {
      const data = doc.data();
      users[data.userId] = {
        userId: data.userId,
        name: `${data.firstName} ${data.lastName}`,
        schedule: data.schedule,
        email: data.email
      };
    });

    // Fetch attendance for date range
    const attendanceSnap = await db.collection("attendance")
      .where("date", ">=", startDateStr)
      .where("date", "<=", endDateStr)
      .get();

    // Group punches by userId and date
    const punchRecordsByUser = {};
    attendanceSnap.forEach(doc => {
      const data = doc.data();
      if (!punchRecordsByUser[data.userId]) punchRecordsByUser[data.userId] = {};
      if (!punchRecordsByUser[data.userId][data.date]) punchRecordsByUser[data.userId][data.date] = [];
      punchRecordsByUser[data.userId][data.date].push({
        punchType: data.punchType,
        time: data.time,
        timestamp: data.createdAt?.toDate?.() || new Date()
      });
    });

    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    // Initialize stats
    const stats = {
      regularHours: [],
      overtime: [],
      undertime: [],
      late: [],
      nightDifferential: [],
      total: 0
    };

    // Categorize users
    for (const [userId, user] of Object.entries(users)) {
      if (!user.schedule) continue;
      stats.total++;

      const userPunchesByDay = punchRecordsByUser[userId] || {};
      const daysWithPunches = Object.keys(userPunchesByDay);
      if (daysWithPunches.length === 0) continue; // skip users with no punches

      let isRegular = true;
      let isOvertime = false;
      let isUndertime = false;
      let isLate = false;
      let isNightDiff = false;

      const schStartMinutes = timeToMinutes(user.schedule.start);
      const schEndMinutes = timeToMinutes(user.schedule.end);

      const nightStart = 22 * 60;
      const nightEnd = 6 * 60;
      const worksNightShift = schStartMinutes >= nightStart || schEndMinutes <= nightEnd;

      for (const dayPunches of Object.values(userPunchesByDay)) {
        const punchIn = dayPunches.find(p => p.punchType === "punchIn");
        const punchOut = dayPunches.find(p => p.punchType === "punchOut");
        if (!punchIn || !punchOut) {
          isRegular = false;
          continue;
        }

        const punchInMinutes = timeToMinutes(punchIn.time);
        const punchOutMinutes = timeToMinutes(punchOut.time);

        if (punchInMinutes > schStartMinutes) { isLate = true; isRegular = false; }
        if (punchOutMinutes < schEndMinutes) { isUndertime = true; isRegular = false; }
        if (punchOutMinutes - punchInMinutes > schEndMinutes - schStartMinutes) { isOvertime = true; isRegular = false; }

        if (worksNightShift && (punchInMinutes >= nightStart || punchOutMinutes <= nightEnd)) {
          isNightDiff = true; isRegular = false;
        }
      }

      if (isRegular) stats.regularHours.push(user);
      if (isOvertime) stats.overtime.push(user);
      if (isUndertime) stats.undertime.push(user);
      if (isLate) stats.late.push(user);
      if (isNightDiff) stats.nightDifferential.push(user);
    }

    res.json({
      period,
      date: targetDate,
      dateRange,
      totalEmployees: stats.total,
      summary: {
        total: stats.total,
        regularHoursCount: stats.regularHours.length,
        overtimeCount: stats.overtime.length,
        undertimeCount: stats.undertime.length,
        lateCount: stats.late.length,
        nightDifferentialCount: stats.nightDifferential.length
      },
      details: stats
    });

  } catch (err) {
    console.error("Error fetching employee stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Punch-in and Punch-out Route
router.post("/punch", async (req, res) => {
  try {
    const { punchType } = req.body; // "punchIn" | "punchOut"
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // detect timezone and current timestamp
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const localDate = now.toLocaleDateString("en-CA", { timezone }); // YYYY-MM-DD
    const localTime = now.toLocaleTimeString("en-GB", { timezone }); // HH:mm:ss

    // Save to Firestore under attendance collection
    const attendanceRef = db.collection("attendance").doc();
    await attendanceRef.set({
      userId,
      punchType,
      date: localDate,
      time: localTime,
      timezone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // // 🔥 Debug log
    // console.log(
    //   `Attendance recorded → userId=${userId}, punchType=${punchType}, date=${localDate}, time=${localTime}, timezone=${timezone}`
    // );

    res.json({
      message: `${punchType} recorded`,
      userId,
      date: localDate,
      time: localTime,
      timezone,
    });
  } catch (err) {
    console.error("Error in /punch:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get attendance by user or all if admin
router.get("/attendance", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let query = db.collection("attendance");

    // If not admin, only fetch for this user
    if (decoded.role !== "admin") {
      query = query.where("userId", "==", decoded.userId);
    }

    const snap = await query.get();
    let records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on server side after fetching
    records.sort((a, b) => {
      const timeA = a.createdAt?.toDate?.() || new Date(0);
      const timeB = b.createdAt?.toDate?.() || new Date(0);
      return timeB - timeA; // descending order
    });

    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get daily summaries
router.get("/daily-summary", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let query = db.collection("dailySummary");

    if (decoded.role !== "admin") {
      query = query.where("userId", "==", decoded.userId);
    }

    const snap = await query.get();
    let records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(records);
  } catch (err) {
    console.error("Error fetching daily summary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Batch process attendance (admin only or scheduled job)
router.post("/batch-process", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const results = await batchProcessAttendance(db);
    
    res.json({
      message: "Batch processing completed",
      processed: results.length,
      results
    });
  } catch (err) {
    console.error("Error in batch processing:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update attendance (admin only)
router.put("/attendance/update", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only admin can edit attendance
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { userId, date, punchIn, punchOut } = req.body;
    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date are required" });
    }

    // ✅ Normalize date to YYYY-MM-DD (no timezone shifting)
    const normalizeDate = (inputDate) => {
      // If already YYYY-MM-DD, return it directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
        return inputDate;
      }
      const d = new Date(inputDate);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const normalizedDate = normalizeDate(date);

    const attendanceRef = db.collection("attendance");
    const existingSnap = await attendanceRef
      .where("userId", "==", userId)
      .where("date", "==", normalizedDate)
      .get();

    if (!existingSnap.empty) {
      // ✅ Update existing doc(s)
      const batch = db.batch();
      existingSnap.forEach((doc) => {
        const data = doc.data();
        const updateData = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (data.punchType === "punchIn" && punchIn) {
          updateData.time = punchIn;
        }
        if (data.punchType === "punchOut" && punchOut) {
          updateData.time = punchOut;
        }

        batch.update(doc.ref, updateData);
      });

      await batch.commit();
      console.log(`✏️ Updated attendance for ${userId} on ${normalizedDate}`);
      return res.json({ message: "Attendance updated successfully" });
    } else {
      // ✅ Create new docs if none exist
      const batch = db.batch();

      if (punchIn) {
        batch.set(attendanceRef.doc(), {
          userId,
          date: normalizedDate,
          punchType: "punchIn",
          time: punchIn,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (punchOut) {
        batch.set(attendanceRef.doc(), {
          userId,
          date: normalizedDate,
          punchType: "punchOut",
          time: punchOut,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();
      console.log(`➕ Created attendance for ${userId} on ${normalizedDate}`);
      return res.json({ message: "Attendance created successfully" });
    }
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update user role and schedule (admin only)
router.put("/update-user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only admin can update users
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { userId, role, shiftStart, shiftEnd } = req.body;
    if (!userId || !role || !shiftStart || !shiftEnd) {
      return res.status(400).json({ message: "userId, role, shiftStart, and shiftEnd are required" });
    }

    // Find the user document by userId
    const usersSnap = await db.collection("users").where("userId", "==", userId).get();
    if (usersSnap.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role and schedule
    const userDoc = usersSnap.docs[0];
    await userDoc.ref.update({
      role,
      schedule: {
        start: shiftStart,
        end: shiftEnd
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "User updated successfully", userId, role, schedule: { start: shiftStart, end: shiftEnd } });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// To save to database
router.post('/total-metrics', async (req, res) => {
    try {
        const { metrics, timestamp, period = "daily" } = req.body;
        
        // Use current date as document ID (format: YYYY-MM-DD)
        const targetDate = new Date().toISOString().split('T')[0];
        
        // Reference to dailySummary collection
        const dailySummaryRef = db.collection("dailySummary").doc(targetDate);

        const metricsData = {
            period,
            date: targetDate,
            timestamp,
            metrics: {
                regularHours: metrics.regularHours || 0,
                overtime: metrics.overtime || 0,
                nightDifferential: metrics.nightDifferential || 0,
                late: metrics.late || 0,
                undertime: metrics.undertime || 0
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Save to Firestore (will overwrite if date already exists)
        await dailySummaryRef.set(metricsData);

        res.status(200).json({ message: "Metrics saved successfully to dailySummary" });
    } catch (error) {
        console.error("Error saving metrics:", error);
        res.status(500).json({ error: "Failed to save metrics" });
    }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

export default router;

// Imported Components...
import ViewIcon from '../assets/eyeWhiteIcon.svg';
import EditIcon from '../assets/editWhiteIcon.svg';
import DoneIcon from "../assets/checkWhiteIcon.svg";
import BackArrow from '../assets/arrow.svg';
import Dropdown from './Dropdown';
import { useState, useRef, useEffect } from 'react';
import { useSelectedOption } from '../contexts/SelectedOptionContext';
import { useUserTypeOption } from "../contexts/UserTypeContext";
import { useMetrics } from "../contexts/MetricsContext";

// Utility: convert "9:00 AM" → Date object (for comparison)
function parseTime(timeStr: string) {
  return new Date(`1970-01-01T${new Date(`1970-01-01 ${timeStr}`).toLocaleTimeString('en-US', { hour12: false })}`);
}

// Utility: decide background color class
function getPunchInClass(time: string) {
  const punch = parseTime(time);
  const shiftStart = parseTime("9:00 AM");

  if (punch.getTime() > shiftStart.getTime()) return "bg-[#D04141]";    // Late
  if (punch.getTime() < shiftStart.getTime()) return "bg-[#DE952F]"; // Early
  return "bg-[#60D748]"; // On-time
}

function getPunchOutClass(time: string) {
  const punch = parseTime(time);
  const shiftEnd = parseTime("6:00 PM");

  if (punch.getTime() < shiftEnd.getTime()) return "bg-[#D04141]";    // Early out
  if (punch.getTime() > shiftEnd.getTime()) return "bg-[#DE952F]"; // Overtime
  return "bg-[#60D748]"; // On-time
}

// Format time from HH:mm:ss to 12-hour format
function formatTime(time24: string) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

// Calculate all attendance metrics in minutes
function calculateMetrics(punchInTime: string, punchOutTime: string, shiftStart = "09:00", shiftEnd = "18:00") {
  if (!punchInTime || !punchOutTime) {
    return {
      regularHours: 0,
      overtime: 0,
      nightDifferential: 0,
      late: 0,
      undertime: 0
    };
  }

  const punchIn = new Date(`2000-01-01T${punchInTime}`);
  const punchOut = new Date(`2000-01-01T${punchOutTime}`);
  const schedStart = new Date(`2000-01-01T${shiftStart}`);
  const schedEnd = new Date(`2000-01-01T${shiftEnd}`);

  // Convert to minutes
  const punchInMin = punchIn.getTime() / (1000 * 60);
  const punchOutMin = punchOut.getTime() / (1000 * 60);
  const schedStartMin = schedStart.getTime() / (1000 * 60);
  const schedEndMin = schedEnd.getTime() / (1000 * 60);

  // Calculate late (minutes late to punch in)
  const late = Math.max(0, punchInMin - schedStartMin);

  // Calculate undertime (minutes left early)
  const undertime = Math.max(0, schedEndMin - punchOutMin);

  // Actual work start/end (clamped to scheduled times for regular hours)
  const workStart = Math.max(punchInMin, schedStartMin);
  const workEnd = Math.min(punchOutMin, schedEndMin);

  // Regular hours = time worked within scheduled shift (in minutes)
  const regularMinutes = Math.max(0, workEnd - workStart);

  // Overtime = time worked after scheduled end
  const overtime = Math.max(0, punchOutMin - schedEndMin);

  // Night differential (22:00 to 06:00) - simplified
  const nightStart = new Date(`2000-01-01T22:00`).getTime() / (1000 * 60);
  const nightEnd = new Date(`2000-01-02T06:00`).getTime() / (1000 * 60);
  
  let nightDifferential = 0;
  if (punchOutMin > nightStart) {
    nightDifferential = Math.min(punchOutMin, nightEnd) - nightStart;
  }

  return {
    regularHours: Math.round((regularMinutes / 60) * 100) / 100,
    overtime: Math.round((overtime / 60) * 100) / 100,
    nightDifferential: Math.round((nightDifferential / 60) * 100) / 100,
    late: Math.round((late / 60) * 100) / 100,
    undertime: Math.round((undertime / 60) * 100) / 100
  };
}

export default function Table() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [groupedAttendance, setGroupedAttendance] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [dailySummaries, setDailySummaries] = useState<any[]>([]);

    const { setAllMetrics } = useMetrics();
    const { selectedOption } = useSelectedOption();
    const { isAdmin } = useUserTypeOption();

    const [openModal, setOpenModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState("");
    const [punchIn, setPunchIn] = useState("09:00");
    const [punchOut, setPunchOut] = useState("18:00");
    const [editMode, setEditMode] = useState(false);
    const [editRow, setEditRow] = useState<number | null>(null);
     const [editShiftStart, setEditShiftStart] = useState<string>("");
    const [editShiftEnd, setEditShiftEnd] = useState<string>("");
    

    const [editValues, setEditValues] = useState({
        role: "employee",
        shiftStart: "09:00",
        shiftEnd: "18:00",
    });


    const SHIFT_PAIRS: Record<string, string> = {
        "09:00": "18:00", // 9AM -> 6PM
        "22:00": "06:00", // 10PM -> 6AM
    };

    const startEditRow = (i: number, emp: any) => {
  setEditRow(i);
  setEditValues({
    role: emp.role || "employee",
    shiftStart: emp.schedule?.shiftStart || "09:00",
    shiftEnd: emp.schedule?.shiftEnd || "18:00",
  });
};



    const punchInRef = useRef<HTMLInputElement>(null);
    const punchOutRef = useRef<HTMLInputElement>(null);

    const actionSelect = (value: string, rowData?: any) => {
        setOpenModal(true);
        setSelectedAction(value);
        if (rowData) {
            setSelectedEmployee(rowData);
            setPunchIn(rowData.rawPunchIn || "09:00");
            setPunchOut(rowData.rawPunchOut || "18:00");
        }
    };

    // 🔹 Fetch data & calculate metrics
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const [res1, res2, res3] = await Promise.all([
                    fetch("http://localhost:5000/api/auth/attendance", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("http://localhost:5000/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("http://localhost:5000/api/auth/daily-summary", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const attendanceData = await res1.json();
                const usersData = await res2.json();
                const summariesData = await res3.json();

                if (res1.ok) {
                    setAttendance(attendanceData);

                    const grouped: Record<string, any> = attendanceData.reduce((acc, record) => {
                        const key = `${record.date}-${record.userId}`;
                        if (!acc[key]) acc[key] = { date: record.date, userId: record.userId, punchIn: null, punchOut: null };
                        if (record.punchType === "punchIn") acc[key].punchIn = record.time;
                        if (record.punchType === "punchOut") acc[key].punchOut = record.time;
                        return acc;
                    }, {});

                    const groupedArray = Object.values(grouped).sort(
                        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    setGroupedAttendance(groupedArray);

                    // setAllMetrics(aggregatedMetrics);
                }

                if (res2.ok) setUsers(usersData);
                if (res3.ok) setDailySummaries(summariesData);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [selectedOption, setAllMetrics]);


    const saveTotalMetricsToBackend = async (metrics: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:5000/api/auth/total-metrics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                metrics: {
                    regularHours: metrics.regularHours,
                    overtime: metrics.overtime,
                    nightDifferential: metrics.nightDifferential,
                    late: metrics.late,
                    undertime: metrics.undertime
                },
                timestamp: new Date().toISOString(),
                period: "daily"
            })
        });

        if (!response.ok) {
            console.error("Failed to save metrics to dailySummary");
        } else {
            // console.log(" Metrics saved to dailySummary collection");
        }
    } catch (err) {
        console.error("Error saving metrics:", err);
    }
};

    // Pass value to useContext
    useEffect(() => {
        if (!isAdmin) return;

        // Recalculate totalMetrics when attendance or users change
        const grouped: Record<string, any> = attendance.reduce((acc, rec) => {
            const key = `${rec.userId}_${rec.date}`;
            if (!acc[key]) {
                acc[key] = { userId: rec.userId, date: rec.date, punchIn: "", punchOut: "" };
            }
            if (rec.punchType === "punchIn" && !acc[key].punchIn) {
                acc[key].punchIn = rec.time;
            }
            if (rec.punchType === "punchOut" && !acc[key].punchOut) {
                acc[key].punchOut = rec.time;
            }
            return acc;
        }, {});

        const groupedList = Object.values(grouped);

        const attendanceRows = users
            .filter((u) => u.role === "employee")
            .flatMap((emp) => {
                const recs = groupedList.filter((rec) => rec.userId === emp.userId && rec.punchIn);
                if (recs.length === 0) return [];

                return recs.map((rec) => {
                    const metrics = calculateMetrics(rec.punchIn, rec.punchOut);
                    return {
                        regularHours: metrics.regularHours,
                        overtime: metrics.overtime,
                        nightDifferential: metrics.nightDifferential,
                        late: metrics.late,
                        undertime: metrics.undertime,
                    };
                });
            });

        const totalMetrics = attendanceRows.reduce(
            (acc, row) => {
                acc.regularHours += row.regularHours || 0;
                acc.overtime += row.overtime || 0;
                acc.nightDifferential += row.nightDifferential || 0;
                acc.late += row.late || 0;
                acc.undertime += row.undertime || 0;
                return acc;
            },
            {
                regularHours: 0,
                overtime: 0,
                nightDifferential: 0,
                late: 0,
                undertime: 0,
            }
        );

        // console.log(totalMetrics)

        // Update setter with value
        setAllMetrics(totalMetrics);

        // Pass to function to pass to backend for saving in database
        saveTotalMetricsToBackend(totalMetrics);

    }, [attendance, users, isAdmin, setAllMetrics]);

    const updateAttendance = async (userId: string, date: string, punchIn: string, punchOut: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5000/api/auth/attendance/update", {
            method: "PUT", // or POST depending on your backend
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId,
                date,
                punchIn,
                punchOut,
            }),
            });

            if (!response.ok) throw new Error("Failed to update attendance");

            // console.log("Attendance updated in DB");
            return await response.json();
        } catch (err) {
            console.error("Error updating attendance:", err);
        }
    };

    

    const handleSave = async () => {
        if (!selectedEmployee) return;

        const { userId, date } = selectedEmployee; // 👈 directly from clicked row

        const result = await updateAttendance(userId, date, punchIn, punchOut);

        if (result) {
            // Update local state so table refreshes without reload
            setAttendance((prev) =>
                prev.map((rec) =>
                    rec.userId === userId && rec.date === date
                        ? { ...rec, punchIn, punchOut }
                        : rec
                )
            );

            setOpenModal(false);
        }
    };




    return (
        <>
            <div className="overflow-y-auto max-h-[585px] no-scrollbar"> 
                <table
                draggable="false"
                className="table-auto border-collapse border-2 border-black w-full h-[550px] text-center"
                >
                <thead className="top-0 bg-gray-100">
                    <tr>
                        {isAdmin ? 
                            <>
                                {selectedOption == 'Employees' ? 
                                
                                <>
                                    {/* Nothing */}
                                </> 
                                
                                : 
                                
                                <>
                                    <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Date</th>
                                </>}
            
                                <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Employee ID</th>
                                <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Employee Name</th>

                                {selectedOption == 'Employees' ? 
                                    <>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Role</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Start-Time</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">End-Time</th>
                                    </>
                                    :
                                    <>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Punch-In</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Punch-Out</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Regular Hours</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Overtime</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Night Differential</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Late</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Undertime</th>
                                    </>}

                                <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Actions</th>
                            </>
                            :
                            <>
                                <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Date</th>

                                {selectedOption == 'Dashboard' ? 
                                    <>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Start Time</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">End Time</th>
                                    </>
                                    :
                                    <>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Regular Hours</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Overtime</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Night Differential</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Late</th>
                                        <th className="border-2 border-black bg-[#B5CBB7] px-4 py-2">Undertime</th>
                                    </>}
                            </>}
                    </tr>
                </thead>

                <tbody>
                    {!isAdmin ? (
                        // Employee Dashboard - last 7 days
                        (() => {
                        const today = new Date();
                        const last7Days = Array.from({ length: 7 }).map((_, i) => {
                            const d = new Date(today);
                            d.setDate(today.getDate() - i);
                            return d;
                        });

                        return last7Days.map((date, i) => {
                            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                            
                            // Try to find daily summary first
                            const summary = dailySummaries.find(
                              (s) => s.date === dateStr
                            );

                            // Fallback to grouped attendance if no summary
                            const record = groupedAttendance.find(
                              (r) => new Date(r.date).toDateString() === date.toDateString()
                            );

                            const punchInTime = summary?.punchIn 
                              ? formatTime(summary.punchIn) 
                              : (record?.punchIn ? formatTime(record.punchIn) : "");
                            
                            const punchOutTime = summary?.punchOut 
                              ? formatTime(summary.punchOut) 
                              : (record?.punchOut ? formatTime(record.punchOut) : "");

                            // Calculate metrics using raw time values
                            const punchInRaw = summary?.punchIn || record?.punchIn || "";
                            const punchOutRaw = summary?.punchOut || record?.punchOut || "";
                            const metrics = calculateMetrics(punchInRaw, punchOutRaw);

                            return (
                            <tr key={i}>
                                <td className="border-2 border-black px-4 py-2">
                                {date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                                </td>
                                {selectedOption == "Dashboard" ? (
                                <>
                                    <td
                                    className={`border-2 border-black px-4 py-2 ${
                                        punchInTime ? getPunchInClass(punchInTime) : ""
                                    }`}
                                    >
                                    {punchInTime || "—"}
                                    </td>
                                    <td
                                    className={`border-2 border-black px-4 py-2 ${
                                        punchOutTime ? getPunchOutClass(punchOutTime) : ""
                                    }`}
                                    >
                                    {punchOutTime || "—"}
                                    </td>
                                </>
                                ) : (
                                <>
                                    <td className="border-2 border-black px-4 py-2">
                                    {punchInRaw && punchOutRaw ? `${metrics.regularHours} hrs` : "0 hrs"}
                                    </td>
                                    <td className="border-2 border-black px-4 py-2">
                                    {metrics.overtime > 0 ? `${metrics.overtime} hrs` : "0 hrs"}
                                    </td>
                                    <td className="border-2 border-black px-4 py-2">
                                    {metrics.nightDifferential > 0 ? `${metrics.nightDifferential} hrs` : "0 hrs"}
                                    </td>
                                    <td className="border-2 border-black px-4 py-2">
                                    {metrics.late > 0 ? `${metrics.late} hrs` : "0 hrs"}
                                    </td>
                                    <td className="border-2 border-black px-4 py-2">
                                    {metrics.undertime > 0 ? `${metrics.undertime} hrs` : "0 hrs"}
                                    </td>
                                </>
                                )}
                            </tr>
                            );
                        });
                        })()
                    ) : (
                    // Admin Dashboard
                    (() => {
                    // 🔹 If viewing Employees, show user list instead of attendance
                    if (selectedOption === 'Employees') {
                        const employeeRows = users.filter((u) => u.role === "employee");
                        
                        // Add placeholders to make minimum 10 rows
                        const placeholdersNeeded = Math.max(0, 10 - employeeRows.length);
                        const placeholderRows = Array.from({ length: placeholdersNeeded }, () => ({
                            userId: "—",
                            firstName: "—",
                            lastName: "",
                            role: "—",
                            shiftStart: "—",
                            shiftEnd: "—",
                        }));

                        const finalRows = [...employeeRows, ...placeholderRows];

                        return finalRows.map((emp, i) => {
                            const isPlaceholder = emp.userId === "—";
                            
                            return (
                            <tr key={i}>
                                <td className="border-2 border-black px-4 py-2">{emp.userId}</td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.firstName || "—"}
                                </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {editRow === i ? (
                                        <Dropdown
                                            options={[
                                                { value: "employee", label: "Employee" },
                                                { value: "admin", label: "Admin" }
                                            ]}
                                            value={editValues.role}
                                            onChange={(val) => setEditValues(prev => ({ ...prev, role: val }))}
                                            />
                                    ) : (
                                        emp.role.charAt(0).toUpperCase() + emp.role.slice(1)
                                    )}
                                    </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {editRow === i ? (
                                        <Dropdown
                                        options={[
                                            { value: "09:00", label: "9:00 AM" },
                                            { value: "22:00", label: "10:00 PM" },
                                        ]}
                                        value={editValues.shiftStart}
                                        onChange={(val) =>
                                            setEditValues((prev) => ({
                                            ...prev,
                                            shiftStart: val,
                                            shiftEnd: SHIFT_PAIRS[val], // sync automatically
                                            }))
                                        }
                                        />
                                    ) : (
                                        isPlaceholder ? "—" : (emp.schedule.shiftStart ? formatTime(emp.schedule.shiftStart) : "9:00 AM")
                                    )}
                                    </td>

                                    <td className="border-2 border-black px-4 py-2">
                                    {editRow === i ? (
                                        <Dropdown
                                        options={[
                                            { value: "18:00", label: "6:00 PM" },
                                            { value: "06:00", label: "6:00 AM" },
                                        ]}
                                        value={editValues.shiftEnd}
                                        disabled
                                        />
                                    ) : (
                                        isPlaceholder ? "—" : (emp.schedule.shiftEnd ? formatTime(emp.schedule.shiftEnd) : "6:00 PM")
                                    )}
                                    </td>
                                <td className="border-2 border-black px-2 py-2">
                                    <div className="inline-flex gap-2 justify-center w-full">
                                    
                                          <button
  onClick={async () => {
    if (selectedOption === "Employees") {
      if (!isPlaceholder) {
        if (editRow === i) {
          // Exiting edit mode → send update request
          try {
            const response = await fetch("http://localhost:5000/api/auth/update-user", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // your JWT token
              },
              body: JSON.stringify({
                userId: emp.userId,
                role: editValues.role,             // make sure role is updated in state
                shiftStart: editValues.shiftStart, // updated start time
                shiftEnd: editValues.shiftEnd,     // updated end time
              }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to update user");

            console.log("User updated:", data);

            setEditMode(false);
          } catch (err) {
            console.error("Error updating user:", err);
          }
        } else {
          startEditRow(i, emp); // Enter edit mode
        }
      }
    } else {
      actionSelect(editRow === i ? "Done" : "Edit", emp);
    }
  }}
  draggable="false"
  disabled={isPlaceholder}
  type="button"
  className={`p-2 rounded-lg shadow-lg select-none ${
    isPlaceholder
      ? "bg-gray-300 cursor-not-allowed opacity-60"
      : "bg-[#B5CBB7] cursor-pointer"
  }`}
>
  <img
    draggable="false"
    src={editRow === i ? DoneIcon : EditIcon}
    className="select-none cursor-pointer h-4"
    alt=""
  />
</button>
                                    </div>
                                </td>
                            </tr>
                        )});
                    }

                    // 🔹 Group attendance by (userId + date)
                    const groupedAttendance = attendance.reduce((acc, rec) => {
                        const key = `${rec.userId}_${rec.date}`;
                        if (!acc[key]) {
                        acc[key] = { userId: rec.userId, date: rec.date, punchIn: "", punchOut: "" };
                        }
                        if (rec.punchType === "punchIn" && !acc[key].punchIn) {
                        acc[key].punchIn = rec.time;
                        }
                        if (rec.punchType === "punchOut" && !acc[key].punchOut) {
                        acc[key].punchOut = rec.time;
                        }
                        return acc;
                    }, {});

                    const groupedList = Object.values(groupedAttendance);

                    // 🔹 Actual attendance rows (only employees who have at least punched in)
                    const attendanceRows = users
                        .filter((u) => u.role === "employee") // only employees
                        .flatMap((emp) => {
                        const recs = groupedList.filter((rec) => rec.userId === emp.userId && rec.punchIn);

                        // 🔹 Skip employees who have not punched in yet
                        if (recs.length === 0) return [];

                        return recs.map((rec) => {
                            // 🔹 Calculate metrics dynamically from punch times
                            const metrics = calculateMetrics(rec.punchIn, rec.punchOut);

                            return {
                              date: new Date(rec.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }),
                              userId: emp.userId,
                              name: `${emp.firstName} ${emp.lastName}`,
                              role: emp.role,
                              punchIn: rec.punchIn ? formatTime(rec.punchIn) : "",
                              punchOut: rec.punchOut ? formatTime(rec.punchOut) : "",
                              regularHours: metrics.regularHours,
                              overtime: metrics.overtime,
                              nightDifferential: metrics.nightDifferential,
                              late: metrics.late,
                              undertime: metrics.undertime,
                              rawPunchIn: rec.punchIn || "",
                             rawPunchOut: rec.punchOut || "",
                            };
                        });
                        });

                        // To calculate the sum of all metrics...
                        const totalMetrics = attendanceRows.reduce(
                            (acc, row) => {
                                acc.regularHours += row.regularHours || 0;
                                acc.overtime += row.overtime || 0;
                                acc.nightDifferential += row.nightDifferential || 0;
                                acc.late += row.late || 0;
                                acc.undertime += row.undertime || 0;
                                return acc;
                            },
                            {
                                regularHours: 0,
                                overtime: 0,
                                nightDifferential: 0,
                                late: 0,
                                undertime: 0,
                            }
                            );

                            // setAllMetrics(totalMetrics);

                        
                        // 🔹 Sort attendance rows by date desc
                        attendanceRows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                        // 🔹 Add placeholders AFTER attendance rows to make 10 rows minimum
                        const placeholdersNeeded = Math.max(0, 10 - attendanceRows.length);
                        const placeholderRows = Array.from({ length: placeholdersNeeded }, () => ({
                            date: "—",
                            userId: "—",
                            name: "—",
                            role: "—",
                            punchIn: "",
                            punchOut: "",
                            regularHours: 0,
                            overtime: 0,
                            nightDifferential: 0,
                            late: 0,
                            undertime: 0,
                        }));

                        // 🔹 Final rows: real first, then placeholders
                        const finalRows = [...attendanceRows, ...placeholderRows];

                        return finalRows.map((emp, i) => {
                            const isPlaceholder = emp.userId === "—";
                            
                            return (
                            <tr key={i}>
                                <td className="border-2 border-black px-4 py-2">{emp.date}</td>
                                <td className="border-2 border-black px-4 py-2">{emp.userId}</td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.name}
                                </td>
                               
                                <td
                                    className={`border-2 border-black px-4 py-2 ${
                                    emp.punchIn ? getPunchInClass(emp.punchIn) : ""
                                    }`}
                                >
                                    {emp.punchIn || "—"}
                                </td>
                                <td
                                    className={`border-2 border-black px-4 py-2 ${
                                    emp.punchOut ? getPunchOutClass(emp.punchOut) : ""
                                    }`}
                                >
                                    {emp.punchOut || "—"}
                                </td>
                                
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.rawPunchIn && emp.rawPunchOut ? `${emp.regularHours} hrs` : "—"}
                                </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.name ? "0 hrs" : "—"}
                                </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.rawPunchIn && emp.rawPunchOut && emp.nightDifferential > 0 ? `${emp.nightDifferential} hrs` : emp.rawPunchIn && emp.rawPunchOut ? "0 hrs" : "—"}
                                </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.rawPunchIn && emp.rawPunchOut && emp.late > 0 ? `${emp.late} hrs` : emp.rawPunchIn && emp.rawPunchOut ? "0 hrs" : "—"}
                                </td>
                                <td className="border-2 border-black px-4 py-2">
                                    {emp.rawPunchIn && emp.rawPunchOut && emp.undertime > 0 ? `${emp.undertime} hrs` : emp.rawPunchIn && emp.rawPunchOut ? "0 hrs" : "—"}
                                </td>


                                <td className="border-2 border-black px-2 py-2">
                                    <div className="inline-flex gap-2 justify-center w-full">
                                        {selectedOption !== "Employees" && (
                                        <button
                                            onClick={() => !isPlaceholder && actionSelect("View", emp)}
                                            disabled={isPlaceholder}
                                            draggable="false"
                                            type="button"
                                            className={`p-2 rounded-lg shadow-lg select-none ${
                                                isPlaceholder
                                                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                                                    : "bg-[#B5CBB7] cursor-pointer"
                                            }`}
                                        >
                                            <img
                                                draggable="false"
                                                src={ViewIcon}
                                                className="select-none cursor-pointer h-4"
                                                alt=""
                                            />
                                        </button>
                                        )}

                                        <button
  onClick={async () => {
    if (selectedOption === "Employees") {
      if (!isPlaceholder) {
        if (editRow === i) {
          // Exiting edit mode → send update request
          try {
            const response = await fetch("http://localhost:5000/api/auth/update-user", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // your JWT token
              },
              body: JSON.stringify({
                userId: emp.userId,
                role: emp.role,             // make sure role is updated in state
                shiftStart: emp.schedule.start, // updated start time
                shiftEnd: emp.schedule.end,     // updated end time
              }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to update user");

            console.log("User updated:", data);
          } catch (err) {
            console.error("Error updating user:", err);
          }
        } else {
          startEditRow(i, emp); // Enter edit mode
        }
      }
    } else {
      actionSelect(editRow === i ? "Done" : "Edit", emp);
    }
  }}
  draggable="false"
  disabled={isPlaceholder}
  type="button"
  className={`p-2 rounded-lg shadow-lg select-none ${
    isPlaceholder
      ? "bg-gray-300 cursor-not-allowed opacity-60"
      : "bg-[#B5CBB7] cursor-pointer"
  }`}
>
  <img
    draggable="false"
    src={editRow === i ? DoneIcon : EditIcon}
    className="select-none cursor-pointer h-4"
    alt=""
  />
</button>

                                    </div>
                                </td>
                            </tr>
                        )});
                        })()
                    )}
                    </tbody>
                </table>
            </div>

            {openModal && (
                <div className='absolute h-screen w-screen top-0 left-0 z-200'>
                    <div className="h-full w-full bg-stone-700 opacity-60"></div>

                    <div className="absolute z-1001 bg-[#F0F8FF] rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit p-8 flex flex-col">
                        <div className="relative items-center">
                            <button onClick={() => {setOpenModal(false)}} draggable='false' type="button">
                                <img draggable='false' src={BackArrow} className="absolute select-none cursor-pointer top-1 left-1 h-8" alt="Back" />
                            </button>
                            <p draggable='false' className="text-black select-none text-3xl inter-semilight text-center">
                                {selectedAction == 'View' ? "Daily Breakdown" : "Edit Daily Breakdown"}
                            </p>
                        </div>

                        <hr draggable='false' className="mt-4 select-none"/>

                        <div className='p-4 flex flex-col gap-4'>
                            <div>
                                <p className="text-black select-none text-lg inter-light">
                                    Employee Name: <span className='inter-semilight'>{selectedEmployee?.name || "N/A"}</span>
                                </p>
                                <p className="text-black select-none text-lg inter-light">
                                    Employee ID: <span className='inter-semilight'>{selectedEmployee?.userId || "N/A"}</span>
                                </p>

                                <p className="text-black select-none text-lg inter-light">
                                    Date: <span className='inter-semilight'>{selectedEmployee?.date || "N/A"}</span>
                                </p>
                                <p className="text-black select-none text-lg inter-light">
                                    Schedule: <span className='inter-semilight'>9:00 AM - 6:00 PM</span>
                                </p>
                                  
                            </div>

                            <div className='flex gap-4 w-full'>
                                {selectedAction === "View" ? (
                                    <>
                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-In</p>
                                            <div className={`${selectedEmployee?.punchIn ? getPunchInClass(selectedEmployee.punchIn) : "bg-gray-300"} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight`}>
                                                {selectedEmployee?.punchIn || "—"}
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-Out</p>
                                            <div className={`${selectedEmployee?.punchOut ? getPunchOutClass(selectedEmployee.punchOut) : "bg-gray-300"} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight`}>
                                                {selectedEmployee?.punchOut || "—"}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-In</p>
                                            <div
                                                className={`${punchIn ? getPunchInClass(formatTime(punchIn)) : "bg-gray-300"} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight cursor-pointer`}
                                                onClick={() => punchInRef.current?.showPicker()}
                                            >
                                                {punchIn ? formatTime(punchIn) : "—"}
                                            </div>
                                            <input
                                                type="time"
                                                ref={punchInRef}
                                                value={punchIn}
                                                onChange={(e) => setPunchIn(e.target.value)}
                                                className="absolute opacity-0 w-0 h-0"
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-Out</p>
                                            <div
                                                className={`${punchOut ? getPunchOutClass(formatTime(punchOut)) : "bg-gray-300"} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight cursor-pointer`}
                                                onClick={() => punchOutRef.current?.showPicker()}
                                            >
                                                {punchOut ? formatTime(punchOut) : "—"}
                                            </div>
                                            <input
                                                type="time"
                                                ref={punchOutRef}
                                                value={punchOut}
                                                onChange={(e) => setPunchOut(e.target.value)}
                                                className="absolute opacity-0 w-0 h-0"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className='flex flex-col'>
                                {(() => {
                                    const metrics = selectedAction === 'View' 
                                        ? {
                                            regularHours: selectedEmployee?.regularHours || 0,
                                            overtime: selectedEmployee?.overtime || 0,
                                            nightDifferential: selectedEmployee?.nightDifferential || 0,
                                            late: selectedEmployee?.late || 0,
                                            undertime: selectedEmployee?.undertime || 0
                                        }
                                        : calculateMetrics(punchIn, punchOut);
                                    
                                    return selectedAction == 'View' ? (
                                        <>
                                            <p className="text-black select-none text-lg inter-light">Regular Hours: <span className='inter-semilight'>{metrics.regularHours} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">Overtime: <span className='inter-semilight'>{metrics.overtime} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">Night Differential: <span className='inter-semilight'>{metrics.nightDifferential} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">Late: <span className='inter-semilight'>{metrics.late} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">Undertime: <span className='inter-semilight'>{metrics.undertime} hours</span></p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-black select-none text-lg inter-light">New Regular Hours: <span className='inter-semilight'>{metrics.regularHours} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">New Overtime: <span className='inter-semilight'>{metrics.overtime} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">New Night Differential: <span className='inter-semilight'>{metrics.nightDifferential} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">New Late: <span className='inter-semilight'>{metrics.late} hours</span></p>
                                            <p className="text-black select-none text-lg inter-light">New Undertime: <span className='inter-semilight'>{metrics.undertime} hours</span></p>
                                        </>
                                    );
                                })()}
                            </div>

                            {selectedAction == 'Edit' && (
                                <div className='flex justify-center w-full mt-8'>
                                    <button draggable='false' onClick={() => {handleSave()}} className='bg-[#B5CBB7] p-4 px-12 text-white text-xl inter-normal rounded-lg shadow-lg select-none cursor-pointer'>
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
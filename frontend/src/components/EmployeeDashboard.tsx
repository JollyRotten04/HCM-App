import DateTime from "./DateTime";
import Table from "./Table";
import { useState, useEffect } from "react";

export default function EmployeeDashboard() {
  // Persisted states
  const [punchedIn, setPunchedIn] = useState(
    JSON.parse(localStorage.getItem("punchedIn") || "false")
  );
  const [punchedOut, setPunchedOut] = useState(
    JSON.parse(localStorage.getItem("punchedOut") || "false")
  );
 
  const [, setCurrentEmployeeId] = useState(
    localStorage.getItem("userId") || ""
  );


  const [firstName] = useState(localStorage.getItem("firstName") || "");
  const [lastName] = useState(localStorage.getItem("lastName") || "");

  // console.log(lastName);

  // Restore session info on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
  if (userId) {
    // console.log("Current logged-in userId:", userId);
    setCurrentEmployeeId(userId);
  }
}, []);

  const togglePunchIn = async () => {
  // If already punched in, do nothing
  if (punchedIn) {
    console.log("Already punched in — no request made.");
    return;
  }

  // Mark as punched in
  setPunchedIn(true);
  localStorage.setItem("punchedIn", "true");

  // Reset punch-out since we are starting fresh
  setPunchedOut(false);
  localStorage.setItem("punchedOut", "false");

  // Only now call backend
  await savePunch("punchIn");
};

const togglePunchOut = async () => {
  // Can't punch out without punching in first
  if (!punchedIn) {
    alert("You need to punch in first!");
    return;
  }

  // If already punched out → reset both
  if (punchedOut) {
    console.log("Resetting state after second Punch-Out click.");
    setPunchedIn(false);
    setPunchedOut(false);
    localStorage.setItem("punchedIn", "false");
    localStorage.setItem("punchedOut", "false");
    return;
  }

  // Mark as punched out
  setPunchedOut(true);
  localStorage.setItem("punchedOut", "true");

  // Only now call backend
  await savePunch("punchOut");
};

  // Local date & time
  const getCurrentDateLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTimeLocal = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Save punch to backend using logged-in userId
async function savePunch(field: "punchIn" | "punchOut") {
  const date = getCurrentDateLocal();
  const timestamp = getCurrentTimeLocal();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Always fetch fresh from storage

  if (!userId || !token) {
    alert("User not logged in");
    return;
  }

  try {
    const response = await fetch(
      "https://hcm-app-ltkf.vercel.app/api/auth/punch",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // send JWT
        },
        body: JSON.stringify({ 
          userId,        // pass userId to backend
          punchType: field,
          date,          // optional: send date
          time: timestamp // optional: send timestamp
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to save punch:", data.message);
      alert(`Failed to save ${field}: ${data.message || "Unknown error"}`);
      return;
    }

    console.log(`${field} saved for ${userId} on ${date} at ${timestamp}`);
  } catch (err) {
    console.error("Error saving punch:", err);
    alert(`Error saving ${field}. Please try again.`);
  }
}


  return (
    <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">
      <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
        <p className="text-black select-none text-3xl inter-semilight portrait:text-center">
          Welcome {firstName} {lastName}!
        </p>

        <DateTime />
      </div>

      {/* Punch In / Out Buttons */}
      <div className="flex portrait:flex-col md:portrait:flex-row lg:portrait:flex-row xl:portrait:flex-row justify-evenly mt-8">
        <div className="flex flex-col gap-4">
          <p className="text-black select-none text-2xl inter-light text-center">
            Start: 9:00AM
          </p>
          <button
            draggable="false"
            onClick={togglePunchIn}
            disabled={punchedOut}
            className={`${
              punchedIn ? "bg-[#B5CBB7]" : "bg-[#cfcfcf]"
            } ${
              punchedOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } select-none w-86 portrait:w-full md:portrait:w-86 lg:portrait:w-86 text-black text-4xl inter-normal p-6 px-12 rounded-xl`}
          >
            {punchedIn ? "Punched-In" : "Punch-In"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-black select-none text-2xl inter-light text-center">
            End: 6:00PM
          </p>
          <button
            draggable="false"
            onClick={togglePunchOut}
            className={`${
              punchedOut ? "bg-[#B5CBB7]" : "bg-[#cfcfcf]"
            } select-none cursor-pointer w-86 portrait:w-full md:portrait:w-86 lg:portrait:w-86 text-black text-4xl inter-normal p-6 px-12 rounded-xl`}
          >
            {punchedOut ? "Punched-Out" : "Punch-Out"}
          </button>
        </div>
      </div>

      {/* Remarks */}
      <div className="flex flex-col gap-4">
        <p className="text-black select-none text-xl inter-light">
          Start Remarks:{" "}
          <span className="inter-normal">
            {punchedIn ? "You have punched in." : "Not yet started"}
          </span>
        </p>
        <p className="text-black select-none text-xl inter-light">
          End Remarks:{" "}
          <span className="inter-normal">
            {punchedOut ? "You have punched out." : "Not yet ended"}
          </span>
        </p>
      </div>

      {/* Recent History */}
      <Table />
    </div>
  );
}

// Imported Components...
import ViewIcon from '../assets/eyeWhiteIcon.svg';
import EditIcon from '../assets/editWhiteIcon.svg';
import DoneIcon from "../assets/checkWhiteIcon.svg";
import BackArrow from '../assets/arrow.svg';
import Datepicker from './Datepicker';
import Dropdown from './Dropdown';
import { useState, useRef } from 'react';
import { useSelectedOption } from '../contexts/SelectedOptionContext';

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


export default function Table() {

    const [openModal, setOpenModal] = useState(false); // Hide Modal by Default
    const [selectedAction, setSelectedAction] = useState("");
    const [punchIn, setPunchIn] = useState("09:00");
    const [punchOut, setPunchOut] = useState("18:00");
    const [editMode, setEditMode] = useState(false);

    // Refs for manual invoking
    const punchInRef = useRef<HTMLInputElement>(null);
    const punchOutRef = useRef<HTMLInputElement>(null);

    // To get the specific row of the clicked edit button...
    const [editRow, setEditRow] = useState<number | null>(null);

    // Use selectedOption context...
    const { selectedOption } = useSelectedOption();

    // useEffect(() => {
    //     console.log(selectedOption);
    // },[selectedOption]);

    const actionSelect = (value: string) => {
        setOpenModal(true);
        setSelectedAction(value);
    };

    return (
        <>
            <div className="overflow-y-auto max-h-[585px] no-scrollbar"> 
                <table
                draggable="false"
                className="table-auto border-collapse border-2 border-black w-full text-center"
                >
                <thead className="top-0 bg-gray-100">
                    <tr>
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
                    </tr>
                </thead>

                <tbody>
                    {[...Array(10)].map((_, i) => {
                    const punchIn = i % 2 === 0 ? "9:05 AM" : "8:50 AM"; // demo values
                    const punchOut = i % 3 === 0 ? "6:00 PM" : "6:15 PM"; // demo values

                    return (
                        <tr key={i}>
                        <td className="border-2 border-black px-4 py-2">Employee-{i + 1}</td>
                        <td className="border-2 border-black px-4 py-2">John Doe</td>

                        {selectedOption === "Employees" ? (
                            <>
                                {editRow === i ? (
                                <td className="border-2 border-black px-4 py-2"><Dropdown /></td>
                                ) : (
                                <td className="border-2 border-black px-4 py-2">Employee</td>
                                )}
                            </>
                            ) : (
                            <>
                                <td className={`border-2 border-black px-4 py-2 ${getPunchInClass(punchIn)}`}>{punchIn}</td>
                                <td className={`border-2 border-black px-4 py-2 ${getPunchOutClass(punchOut)}`}>{punchOut}</td>
                            </>
                            )}
                        
                            {selectedOption == 'Employees' ? 
                            
                            <>
                                {editRow === i ? (
                                    <>
                                        <td className="border-2 border-black px-4 py-2"><Dropdown /></td>
                                        <td className="border-2 border-black px-4 py-2"><Dropdown /></td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border-2 border-black px-4 py-2">8 hrs</td>
                                        <td className="border-2 border-black px-4 py-2">30 mins</td>
                                    </>
                                )}
                            </>
                            
                            :
                            
                            <>
                                <td className="border-2 border-black px-4 py-2">8 hrs</td>
                                <td className="border-2 border-black px-4 py-2">30 mins</td>
                            </>}

                        {selectedOption == 'Employees' ?
                        
                        <>
                            {/* Display nothing if selection option is employees */}
                        </>
                        
                        :
                        
                        <>
                            <td className="border-2 border-black px-4 py-2">0</td>
                            <td className="border-2 border-black px-4 py-2">0</td>
                            <td className="border-2 border-black px-4 py-2">0</td>            
                        </>}
            
                        <td className="border-2 border-black px-4 py-2">
                            <div className="flex gap-2 justify-center">

                                {selectedOption == 'Employees' ?
                                
                                <>
                                    {/* Show nothing if Employees Option is Selected */}
                                </>
                                
                                :
                                
                                <>
                                    <button
                                        onClick={() => {actionSelect("View")}}
                                        draggable="false"
                                        type="button"
                                        className="p-2 bg-[#B5CBB7] rounded-lg shadow-lg select-none cursor-pointer"
                                    >
                                        <img
                                        draggable="false"
                                        src={ViewIcon}
                                        className="select-none cursor-pointer h-4"
                                        alt=""
                                        />
                                    </button>
                                </>}
                                <button
                                    onClick={() => {
                                        if (selectedOption === "Employees") {
                                        setEditRow(editRow === i ? null : i); // toggle only that row
                                        } else {
                                        actionSelect("Edit");
                                        }
                                    }}
                                    draggable="false"
                                    type="button"
                                    className="p-2 bg-[#B5CBB7] rounded-lg shadow-lg select-none cursor-pointer"
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
                    );
                    })}
                </tbody>
                </table>
            </div>

            {openModal ? 
            
            <>
                {/* Modal for Auditing Specific Employees */}
                <div className='absolute h-screen w-screen top-0 left-0 z-200'>

                    {/* Overlay */}
                    <div className="h-full w-full bg-stone-700 opacity-60"></div>

                    <div className="absolute z-1001 bg-[#F0F8FF] rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit p-8 flex flex-col">

                        <div className="relative items-center">

                            <button onClick={() => {setOpenModal(false)}} draggable='false' type="button"><img draggable='false' src={BackArrow} className="absolute select-none cursor-pointer top-1 left-1 h-8" alt="Back" /></button>

                            <p draggable='false' className="text-black select-none text-3xl inter-semilight text-center">{selectedAction == 'View' ? "Daily Breakdown" : "Edit Daily Breakdown"}</p>
                        </div>

                        <hr draggable='false' className="mt-4 select-none"/>

                        <div className='p-4 flex flex-col gap-4'>
                            
                            <div>
                                <p className="text-black select-none text-lg inter-light">Employee Name: <span className='inter-semilight'>John Doe</span></p>
                                <p className="text-black select-none text-lg inter-light">Employee ID: <span className='inter-semilight'>Employee-104</span></p>

                                {selectedAction == 'View' ? 
                                
                                <>
                                    <p className="text-black select-none text-lg inter-light">Schedule: <span className='inter-semilight'>9AM - 6PM</span></p>
                                </>
                                
                                :
                                
                                <>
                                    <div className='flex gap-4 items-center'>
                                        <p className="text-black select-none text-lg inter-light">Date: </p>

                                        <Datepicker />
                                    </div>
                                </>}
                            </div>

                            {/* Punch-In and Punch-Out */}
                            <div className='flex gap-4 w-full'>

                                    {selectedAction === "View" ? (
                                    <>
                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-In</p>
                                            <div className="bg-[#60D748] p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight">
                                            {new Date(`2000-01-01T${punchIn}`).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <p className="text-black select-none text-lg inter-light">Punch-Out</p>
                                            <div className="bg-[#60D748] p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight">
                                            {new Date(`2000-01-01T${punchOut}`).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            </div>
                                        </div>
                                        </>
                                    ) : (
                                        <>

                                       {/* Edit Punch-In and Punch-Out */}
                                        <div className='flex gap-4 w-full'>
                                            {selectedAction === "View" ? (
                                                <>
                                                {/* Punch-In */}
                                                <div className="flex flex-col w-full">
                                                    <p className="text-black select-none text-lg inter-light">Punch-In</p>
                                                    <div className={`${getPunchInClass(punchIn)} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight`}>
                                                    {new Date(`2000-01-01T${punchIn}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    </div>
                                                </div>

                                                {/* Punch-Out */}
                                                <div className="flex flex-col w-full">
                                                    <p className="text-black select-none text-lg inter-light">Punch-Out</p>
                                                    <div className={`${getPunchOutClass(punchOut)} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight`}>
                                                    {new Date(`2000-01-01T${punchOut}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    </div>
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                {/* Editable Punch-In */}
                                                <div className="flex flex-col w-full">
                                                    <p className="text-black select-none text-lg inter-light">Punch-In</p>
                                                    <div
                                                    className={`${getPunchInClass(punchIn)} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight cursor-pointer`}
                                                    onClick={() => punchInRef.current?.showPicker()}
                                                    >
                                                    {new Date(`2000-01-01T${punchIn}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    </div>

                                                    {/* Hidden input */}
                                                    <input
                                                    type="time"
                                                    ref={punchInRef}
                                                    value={punchIn}
                                                    onChange={(e) => setPunchIn(e.target.value)}
                                                    className="absolute opacity-0 w-0 h-0"
                                                    />
                                                </div>

                                                {/* Editable Punch-Out */}
                                                <div className="flex flex-col w-full">
                                                    <p className="text-black select-none text-lg inter-light">Punch-Out</p>
                                                    <div
                                                    className={`${getPunchOutClass(punchOut)} p-4 px-8 w-full rounded-xl text-center text-2xl inter-semilight cursor-pointer`}
                                                    onClick={() => punchOutRef.current?.showPicker()}
                                                    >
                                                    {new Date(`2000-01-01T${punchOut}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    </div>

                                                    {/* Hidden input */}
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
                                    </>
                                )}
                            </div>

                            {/* Punch-In and Out Descriptions */}
                            <div className='flex flex-col'>
                                {selectedAction == 'View' ? 
                                
                                <>
                                    <p className="text-black select-none text-lg inter-light">Regular Hours: <span className='inter-semilight'>8 hours</span></p>
                                    <p className="text-black select-none text-lg inter-light">Overtime: <span className='inter-semilight'>0 minutes</span></p>
                                    <p className="text-black select-none text-lg inter-light">Late: <span className='inter-semilight'>0 minutes</span></p>
                                    <p className="text-black select-none text-lg inter-light">Undertime: <span className='inter-semilight'>0 minutes</span></p>
                                </>
                                
                                :
                                
                                <>
                                    <p className="text-black select-none text-lg inter-light">New Regular Hours: <span className='inter-semilight'>8 hours</span></p>
                                    <p className="text-black select-none text-lg inter-light">New Overtime: <span className='inter-semilight'>0 minutes</span></p>
                                    <p className="text-black select-none text-lg inter-light">New Late: <span className='inter-semilight'>0 minutes</span></p>
                                    <p className="text-black select-none text-lg inter-light">New Undertime: <span className='inter-semilight'>0 minutes</span></p>
                                </>}
                            </div>

                            {/* Save Button, Renders only in Edit Option */}
                            {selectedAction == 'Edit' ?
                            
                            <>
                                <div className='flex justify-center w-full mt-8'>

                                    <button draggable='false' className='bg-[#B5CBB7] p-4 px-12 text-white text-xl inter-normal rounded-lg shadow-lg select-none cursor-pointer'>Save</button>
                                </div>
                            </>
                            
                            :
                            
                            <>
                            
                            </>}
                        </div>
                    </div>
                </div>
            </>
            
            :
            
            <>
            
            </>}
        </>
    );
}

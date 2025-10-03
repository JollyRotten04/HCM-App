// Imported components
import HamburgerIcon from "../assets/hamburgerIcon.svg";
import DashboardIcon from "../assets/dashboardIcon.svg";
import EmployeesIcon from "../assets/userIcon.svg";
import HistoryIcon from "../assets/historyIcon.svg";
import LogoutIcon from "../assets/logoutIcon.svg";
import SelectedDashboardIcon from "../assets/selectedDashboardIcon.svg";
import SelectedEmployeesIcon from "../assets/selectedUserIcon.svg";
import SelectedHistoryIcon from "../assets/selectedHistoryIcon.svg";
import { useState } from "react";
import { useSelectedOption } from "../contexts/SelectedOptionContext";

export default function Navbar({ toggleLogout, isAdmin }) {
  const [openNavbar, setOpenNavbar] = useState(false);

  const { selectedOption, setSelectedOption } = useSelectedOption();

  const toggleNavbar = () => {
    setOpenNavbar((prev) => !prev);
  };

  return (
    <>
      <div className="bg-transparent landscape:bg-[#cfcfcf] fixed top-0 left-0 z-100">

        {/* Mobile View */}
        <div className="relative landscape:hidden w-screen p-4">
        
          <button className="h-fit w-fit relative z-50" onClick={toggleNavbar}>

            <img src={HamburgerIcon} draggable="false" alt="Menu" className={`cursor-pointer w-6 h-6 select-none transition-all duration-300 ease-in-out ${openNavbar ? "rotate-90" : "rotate-0"}`}/>

          </button>

          {/* Expanding Menu */}
          <div
            className={`absolute top-0 left-0 ${openNavbar ? "w-1/2 h-screen bg-[#cfcfcf]" : "w-0 h-screen"} flex flex-col flex-1 transition-all shadow-xl duration-300 ease-in-out overflow-hidden p-4`}>

            <div className={`${openNavbar ? "block" : "hidden"} absolute left-0 transition-all w-full duration-400 ease-in-out py-16 flex flex-col justify-between h-full`}>

              <div className="flex flex-col">

                <button draggable="false" className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "Dashboard" ? "bg-[#B5CBB7]" : ""}`}onClick={() => {setSelectedOption("Dashboard"); setOpenNavbar(false);}}>

                  {selectedOption === "Dashboard" ? 
                    (
                    <img draggable="false" src={SelectedDashboardIcon} className="h-8 w-8 select-none" alt="" />
                    ) 
                    : 
                    (
                    <img draggable="false" src={DashboardIcon} className="h-8 w-8 select-none" alt="" />
                    )}

                    <p className={`text-black select-none text-xl inter-light ${selectedOption === "Dashboard" ? "text-white" : ""}`}>Dashboard</p>
                </button>

                {isAdmin && 
                (
                  <button draggable="false"
                    className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "Employees" ? "bg-[#B5CBB7]" : ""}`} onClick={() => {setSelectedOption("Employees"); setOpenNavbar(false);}}>
                    {selectedOption === "Employees" ? (
                      <img draggable="false" src={SelectedEmployeesIcon} className="h-8 w-8 select-none" alt="" />
                    ) : (
                      <img draggable="false" src={EmployeesIcon} className="h-8 w-8 select-none" alt="" />)}

                    <p className={`text-black select-none text-xl inter-light ${selectedOption === "Employees" ? "text-white" : ""}`}>Employees</p>
                  </button>
                )}

                    <button draggable="false" className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "History" ? "bg-[#B5CBB7]" : ""}`} onClick={() => {setSelectedOption("History"); setOpenNavbar(false);}}>

                    {selectedOption === "History" ? (
                        <img draggable="false" src={SelectedHistoryIcon} className="h-8 w-8 select-none" alt=""/>
                        ) : (
                        <img draggable="false" src={HistoryIcon} className="h-8 w-8 select-none" alt=""/>)}

                    <p className={`text-black select-none text-xl inter-light ${selectedOption === "History" ? "text-white" : ""}`}>History</p>

                        </button>
                    </div>
                <div>

                <button className="cursor-pointer select-none flex gap-2 p-4 w-full">

                  <img draggable="false" src={LogoutIcon} className="h-8 w-8 select-none" alt=""/>

                  <p className="text-black select-none text-xl inter-light">Sign-out</p>
                  
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop and Large Screen View */}
        <div className="relative portrait:hidden sm:block w-76 h-screen box-border">

            <div className="relative h-full box-border">

                <div className="absolute left-0 flex flex-col w-full h-full py-24 box-border">

                    <p className="text-black select-none text-xl inter-light ml-4">MENU</p>

                    <div className="flex flex-col h-full justify-between pt-8 box-border">

                        <div className="flex flex-col">
                            <button draggable="false" className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "Dashboard" ? "bg-[#B5CBB7]" : ""}`}onClick={() => {setSelectedOption("Dashboard"); setOpenNavbar(false);}}>

                            {selectedOption === "Dashboard" ? 
                                (
                                <img draggable="false" src={SelectedDashboardIcon} className="h-8 w-8 select-none" alt="" />
                                ) 
                                : 
                                (
                                <img draggable="false" src={DashboardIcon} className="h-8 w-8 select-none" alt="" />
                                )}

                                <p className={`text-black select-none text-xl inter-light ${selectedOption === "Dashboard" ? "text-white" : ""}`}>Dashboard</p>
                            </button>

                            {isAdmin && 
                            (
                            <button draggable="false"
                                className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "Employees" ? "bg-[#B5CBB7]" : ""}`} onClick={() => {setSelectedOption("Employees"); setOpenNavbar(false);}}>
                                {selectedOption === "Employees" ? (
                                <img draggable="false" src={SelectedEmployeesIcon} className="h-8 w-8 select-none" alt="" />
                                ) : (
                                <img draggable="false" src={EmployeesIcon} className="h-8 w-8 select-none" alt="" />)}

                                <p className={`text-black select-none text-xl inter-light ${selectedOption === "Employees" ? "text-white" : ""}`}>Employees</p>
                            </button>
                            )}

                                <button draggable="false" className={`cursor-pointer select-none flex gap-2 p-4 ${selectedOption === "History" ? "bg-[#B5CBB7]" : ""}`} onClick={() => {setSelectedOption("History"); setOpenNavbar(false);}}>

                                {selectedOption === "History" ? (
                                    <img draggable="false" src={SelectedHistoryIcon} className="h-8 w-8 select-none" alt=""/>
                                    ) : (
                                    <img draggable="false" src={HistoryIcon} className="h-8 w-8 select-none" alt=""/>)}

                                <p className={`text-black select-none text-xl inter-light ${selectedOption === "History" ? "text-white" : ""}`}>History</p>

                                    </button>
                                </div>
                            <div>
                        </div>

                        <div>
                            <button onClick={() => {toggleLogout(true)}} className="cursor-pointer select-none flex gap-2 p-4 w-full">

                            <img draggable="false" src={LogoutIcon} className="h-8 w-8 select-none" alt=""/>

                            <p className="text-black select-none text-xl inter-light">Sign-out</p>
                            
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

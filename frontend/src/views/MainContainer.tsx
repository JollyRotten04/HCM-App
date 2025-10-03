// Imported component...
import Navbar from "../components/Navbar";
import AdminDashboard from "../components/AdminDashboard";
import AdminEmployees from "../components/AdminEmployees";
import AdminHistory from "../components/AdminHistory";
import EmployeeDashboard from "../components/EmployeeDashboard";
import { useSelectedOption } from "../contexts/SelectedOptionContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainContainer(){

    const [logoutModal, setLogoutModal] = useState(false);
    const { selectedOption } = useSelectedOption(); // Selects Dashboard in Navbar by default...
    const [isAdmin, setIsAdmin] = useState(false);

    // To navigte back to login when pressing back...
    const navigate = useNavigate();

    const toggleLogout = (value: boolean) => {
        setLogoutModal(value);
    };

    // useEffect(() => {
    //     console.log(selectedOption);
    // }, [selectedOption]);

    return(
        <>
            <div className="relative bg-[#F0F8FF] h-full w-full p-8 flex flex-col">

                <Navbar toggleLogout={toggleLogout} isAdmin={isAdmin} />

                {/* Main Container */}
                <div className="h-full flex-1 landscape:ml-76 p-4 portrait:p-0 portrait:md:p-4 portrait:lg:p-8 portrait:xl:p-8 overflow-y-auto overflow-x-hidden scrollbar-overlay">

                    {isAdmin ? 
                    
                    <>
                        {selectedOption === "Dashboard" && <AdminDashboard />}
                        {selectedOption === "Employees" && <AdminEmployees />}
                        {selectedOption === "History" && <AdminHistory />}
                    </>
                    
                    :
                    
                    <>
                        {selectedOption === "Dashboard" && <EmployeeDashboard />}
                        {/* {selectedOption === "History" && <AdminHistory />} */}
                    </>}
                </div>
            </div>



            {logoutModal ?
            
            <>
                {/* Logout Modal */}
                <div className="absolute top-0 left-0 z-1000 h-screen w-screen shadow-xl">

                    {/* Overlay */}
                    <div className="bg-stone-700 opacity-50 h-full w-full"></div>

                    {/* Modal Container */}
                    <div className="absolute z-1001 bg-[#F0F8FF] rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit p-8 flex flex-col gap-12">

                        <div className="flex flex-col">
                            <p className="text-black select-none text-3xl inter-semilight text-center">Logout Confirmation</p>

                            <hr draggable='false' className="mt-4" />
                        </div>

                        <p className="text-black select-none text-2xl inter-light text-center">Are you sure you want to log-out?</p>

                        {/* Button Containers */}
                        <div className="p-4 flex justify-evenly">

                            <button type="button" onClick={() => {setLogoutModal(false)}} draggable='false' className="bg-red-500 select-none cursor-pointer text-white rounded-xl inter-normal p-4 h-16 w-36 shadow-lg">
                                Go Back
                            </button>

                            <button type="button" onClick={() => navigate("/")} draggable='false' className="bg-green-500 select-none cursor-pointer text-white rounded-xl inter-normal p-4 h-16 w-36 shadow-lg">
                                Sign-out
                            </button>
                        </div>
                    </div>
                </div>
            </>
            
            :   
            <>
                {/* Display Nothing if not invoked */}
            </>}
        </>
    );
}
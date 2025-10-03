// Imported components...
import DateTime from "./DateTime";
import Table from "./Table";

export default function EmployeeDashboard(){
    return(
        <>
            <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">
            
                <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">Welcome Bitchass!</p>
            
                    {/* Date, Day, And Time Component */}
                    <DateTime />
                </div>

                {/* Punch In and Punch Out */}
                <div className="flex justify-evenly mt-8">

                    <div className="flex flex-col gap-4">
                        <p className="text-black select-none text-2xl inter-light text-center">Start: 9:00AM</p>

                        <button className="bg-[#cfcfcf] w-72 text-black text-4xl inter-normal p-6 px-12 rounded-xl">Punch-In</button>
                    </div>

                     <div className="flex flex-col gap-4">
                        <p className="text-black select-none text-2xl inter-light text-center">End: 6:00PM</p>

                        <button className="bg-[#cfcfcf] w-72 text-black text-4xl inter-normal p-6 px-12 rounded-xl">Punch-Out</button>
                    </div>
                </div>

                {/* Punch-In Punch-Out Remarks */}
                <div className="flex flex-col gap-4">

                    <p className="text-black select-none text-xl inter-light">Start Remarks: <span className="inter-normal">Not yet started</span></p>
                    <p className="text-black select-none text-xl inter-light">End Remarks: <span className="inter-normal">Not yet ended</span></p>
                </div>

                {/* Recent History, 7 Days */}
                <Table />
            </div>
        </>
    );
}
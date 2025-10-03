// Imported components...
import IncreaseIcon from '../assets/increaseIcon.svg';
import DecreaseIcon from '../assets/decreaseIcon.svg';

export default function KPIMetrics(){
    return(
        <>
            {/* KPI Containers */}
                <div draggable='false' className="flex justify-evenly portrait:grid portrait:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] place-items-center gap-4">

                    {/* Regular Hours */}
                    <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                        <div className="items-center flex flex-col">
                            <p className="text-black select-none text-lg text-center inter-light">Regular Hours</p>

                            {/* Performance Stat */}
                            <div className="flex items-center">
                                <img draggable='false' className="h-4 select-none" src={IncreaseIcon} alt="" />

                                <p className="text-green-500 select-none text-base inter-semilight">+12%</p>
                            </div>
                        </div>

                        {/* Number of Employees in Regular Category */}
                        <div className="flex flex-col items-center">
                            <p className="text-black select-none text-4xl inter-semilight">25</p>
                            <p className="text-black select-none text-xl inter-light">Employee/s</p>
                        </div>

                        <div className="flex justify-between">

                            <p className="text-black select-none text-xs inter-light">Value: <span className="text-green-500 font-semibold">90%</span></p>

                            <p className="text-black select-none text-xs inter-light">Target: <span className="text-green-500 font-semibold"> {">90%"}</span></p>
                        </div>
                    </div>

                    {/* Overtime */}
                    <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                        <div className="items-center flex flex-col">
                            <p className="text-black select-none text-lg text-center inter-light">Overtime</p>

                            {/* Performance Stat */}
                            <div className="flex items-center">
                                <img draggable='false' className="h-4 select-none" src={IncreaseIcon} alt="" />

                                <p className="text-green-500 select-none text-base inter-semilight">+12%</p>
                            </div>
                        </div>

                        {/* Number of Employees in Regular Category */}
                        <div className="flex flex-col items-center">
                            <p className="text-black select-none text-4xl inter-semilight">25</p>
                            <p className="text-black select-none text-xl inter-light">Employee/s</p>
                        </div>

                        <div className="flex justify-between">

                            <p className="text-black select-none text-xs inter-light">Value: <span className="text-green-500 font-semibold">90%</span></p>

                            <p className="text-black select-none text-xs inter-light">Target: <span className="text-green-500 font-semibold"> {">90%"}</span></p>
                        </div>
                    </div>

                    {/* Night Differential */}
                    <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                        <div className="items-center flex flex-col">
                            <p className="text-black select-none text-lg text-center inter-light">Night Differential</p>

                            {/* Performance Stat */}
                            <div className="flex items-center">
                                <img draggable='false' className="h-4 select-none" src={IncreaseIcon} alt="" />

                                <p className="text-green-500 select-none text-base inter-semilight">+12%</p>
                            </div>
                        </div>

                        {/* Number of Employees in Regular Category */}
                        <div className="flex flex-col items-center">
                            <p className="text-black select-none text-4xl inter-semilight">25</p>
                            <p className="text-black select-none text-xl inter-light">Employee/s</p>
                        </div>

                        <div className="flex justify-between">

                            <p className="text-black select-none text-xs inter-light">Value: <span className="text-green-500 font-semibold">90%</span></p>

                            <p className="text-black select-none text-xs inter-light">Target: <span className="text-green-500 font-semibold"> {">90%"}</span></p>
                        </div>
                    </div>

                    {/* Late */}
                    <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                        <div className="items-center flex flex-col">
                            <p className="text-black select-none text-lg text-center inter-light">Late</p>

                            {/* Performance Stat */}
                            <div className="flex items-center">
                                <img draggable='false' className="h-4 select-none" src={IncreaseIcon} alt="" />

                                <p className="text-green-500 select-none text-base inter-semilight">+12%</p>
                            </div>
                        </div>

                        {/* Number of Employees in Regular Category */}
                        <div className="flex flex-col items-center">
                            <p className="text-black select-none text-4xl inter-semilight">25</p>
                            <p className="text-black select-none text-xl inter-light">Employee/s</p>
                        </div>

                        <div className="flex justify-between">

                            <p className="text-black select-none text-xs inter-light">Value: <span className="text-green-500 font-semibold">90%</span></p>

                            <p className="text-black select-none text-xs inter-light">Target: <span className="text-green-500 font-semibold"> {">90%"}</span></p>
                        </div>
                    </div>

                    <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                        <div className="items-center flex flex-col">
                            <p className="text-black select-none text-lg text-center inter-light">Undertime</p>

                            {/* Performance Stat */}
                            <div className="flex items-center">
                                <img draggable='false' className="h-4 select-none" src={IncreaseIcon} alt="" />

                                <p className="text-green-500 select-none text-base inter-semilight">+12%</p>
                            </div>
                        </div>

                        {/* Number of Employees in Regular Category */}
                        <div className="flex flex-col items-center">
                            <p className="text-black select-none text-4xl inter-semilight">25</p>
                            <p className="text-black select-none text-xl inter-light">Employee/s</p>
                        </div>

                        <div className="flex justify-between">

                            <p className="text-black select-none text-xs inter-light">Value: <span className="text-green-500 font-semibold">90%</span></p>

                            <p className="text-black select-none text-xs inter-light">Target: <span className="text-green-500 font-semibold"> {">90%"}</span></p>
                        </div>
                    </div>
                </div>
        </>
    );
}
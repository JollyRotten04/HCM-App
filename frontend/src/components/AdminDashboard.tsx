// Imported components...
import DateTime from "./DateTime";
import KPIMetrics from "./KPIMetrics";
import Dropdown from "./Dropdown";
import Chart from "./Chart";
import Table from './Table';
import { useState } from "react";

export default function AdminDashboard(){

    const [selectedTimePeriod, setSelectedTimePeriod] = useState("Daily"); // Selects Daily By Default
    const [selectedMetric, setSelectedMetric] = useState("Regular Hours"); // Selects Regular Hours By Default

    return(
        <>

            <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">

                <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">Welcome, Admin!</p>

                    {/* Date, Day, And Time Component */}
                    <DateTime />
                </div>

                <div>
                    <KPIMetrics />
                </div>

                {/* Chart Container */}
                <div className="flex flex-col gap-8">

                    {/* Top Buttons */}
                    <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row gap-4">

                        <button onClick={() => {setSelectedTimePeriod('Daily')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedTimePeriod == 'Daily' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Daily</button>

                        <button onClick={() => {setSelectedTimePeriod('Weekly')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedTimePeriod == 'Weekly' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Weekly</button>

                        <button onClick={() => {setSelectedTimePeriod('Monthly')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedTimePeriod == 'Monthly' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Monthly</button>
                    </div>

                    {/* Chart */}
                    <div className="h-[30rem] w-full bg-[#cfcfcf] p-8 rounded-xl">
                        <Chart></Chart>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row justify-between gap-4">

                        <button onClick={() => {setSelectedMetric('Regular Hours')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedMetric == 'Regular Hours' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Regular Hours</button>

                        <button onClick={() => {setSelectedMetric('Overtime')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedMetric == 'Overtime' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Overtime</button>

                        <button onClick={() => {setSelectedMetric('Night Differential')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedMetric == 'Night Differential' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Night Differential</button>

                        <button onClick={() => {setSelectedMetric('Late')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedMetric == 'Late' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Late</button>

                        <button onClick={() => {setSelectedMetric('Undertime')}} draggable='false' className={`transition-all duration-300 ease-in-out p-4 w-full select-none cursor-pointer rounded-lg inter-normal text-xl ${selectedMetric == 'Undertime' ? 'bg-[#B5CBB7] text-white shadow-lg' : 'bg-[#cfcfcf] text-black'}`} type="button">Undertime</button>
                    </div>
                </div>

                {/* Daily History Table */}
                <div className="w-full flex flex-col">

                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">Daily Table</p>

                    <div className="ml-auto">
                        <p className="text-black select-none text-lg inter-semilight portrait:text-center">Sort By:</p>

                        <Dropdown />
                    </div>

                    {/* Table */}
                    <div className="mt-8 flex flex-col gap-8">
                       
                        <Table />

                        {/* Aggregate Row */}
                        <div className="grid grid-cols-6 border border-black w-full text-center">

                            {/* Labels Row */}
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Daily Total</div>
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Regular Hours</div>
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Overtime</div>
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Night Differential</div>
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Late</div>
                            <div className="border-2 border-black px-4 py-2 font-bold bg-[#B5CBB7]">Undertime</div>

                            {/* Values Row */}
                            <div className="border-2 border-black px-4 py-2 bg-gray-100 font-semibold"></div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">68 hrs 5 mins</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">1 hr 15 mins</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">8 hrs</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">2 hrs 5 mins</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">1 hr 10 mins</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
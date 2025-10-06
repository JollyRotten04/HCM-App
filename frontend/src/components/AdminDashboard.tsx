// Imported components...
import DateTime from "./DateTime";
import KPIMetrics from "./KPIMetrics";
import Chart from "./Chart";
import Table from './Table';
import { useState } from "react";
import { useMetrics } from "../contexts/MetricsContext";

export default function AdminDashboard(){

    const [selectedTimePeriod, setSelectedTimePeriod] = useState("Daily"); // Selects Daily By Default

    const { allMetrics } = useMetrics();

    return(
        <>

            <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">

                <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">Welcome, Admin!</p>

                    {/* Date, Day, And Time Component */}
                    <DateTime />
                </div>

                <div>
                    <KPIMetrics selectedTimePeriod={selectedTimePeriod}/>
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
                </div>

                {/* Daily History Table */}
                <div className="w-full flex flex-col">

                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">Daily Table</p>

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
                            <div className="border-2 border-black px-4 py-2 bg-gray-100"></div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">{(allMetrics?.regularHours || 0).toFixed(2)} hours</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">{(allMetrics?.overtime || 0).toFixed(2)} hours</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">{(allMetrics?.nightDifferential || 0).toFixed(2)} hours</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">{(allMetrics?.late || 0).toFixed(2)} hours</div>
                            <div className="border-2 border-black px-4 py-2 bg-gray-100">{(allMetrics?.undertime || 0).toFixed(2)} hours</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
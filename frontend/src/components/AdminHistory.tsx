// Imported components...
import DateTime from "./DateTime";
import Table from "./Table";
import { useMetrics } from "../contexts/MetricsContext";

export default function AdminHistory(){

    const { allMetrics } = useMetrics();
    return(
        <>
            <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">
            
                <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">History Table</p>
            
                    {/* Date, Day, And Time Component */}
                    <DateTime />
                </div>

                {/* Table Container */}
                <div className="flex flex-col gap-4">

                    {/* Table */}
                    <div className="flex flex-col gap-8">
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
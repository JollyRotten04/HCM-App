// Imported components...
import DateTime from "./DateTime";
import Dropdown from "./Dropdown";
import Table from "./Table";

export default function AdminEmployees(){

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
                    </div>
                </div>
            </div>
        </>
    );
}
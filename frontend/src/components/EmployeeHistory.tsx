// Imported components...
import DateTime from "./DateTime";
import Table from "./Table";
import { useSelectedOption } from '../contexts/SelectedOptionContext';

export default function EmployeeHistory(){

    // Use selectedOption context...
    const { selectedOption } = useSelectedOption();

    return(
        <>
            <div className="h-full w-full flex flex-col gap-8 scrollbar-overlay">
                <div className="flex justify-between portrait:flex-col portrait:md:flex-row portrait:lg:flex-row portrait:xl:flex-row">
                    <p className="text-black select-none text-3xl inter-semilight portrait:text-center">{selectedOption == 'Dashboard' ? "Welcome Bitchass!" : "History Table"}</p>
                        
                    {/* Date, Day, And Time Component */}
                    <DateTime />
                </div>

                <div className="my-auto">
                    <Table />
                </div>
            </div>
        </>
    );
}
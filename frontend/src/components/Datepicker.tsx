// Imported Components...
import { useRef } from "react";

export default function Datepicker() {
    // Ref for manually invoking the showPicker method, need for more control when trying to open the datepicker...
    const inputRef = useRef<HTMLInputElement>(null);

    // Function to manually open the datepicker...
    const openDatepicker = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // Native date picker API...
      inputRef.current.click();        // Fallback for browsers without showPicker...
    }
  };
  
  return (
    <>
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5">
        
        </div>
        <button typeof="button" type="button" onClick={openDatepicker}>

            <input
                ref={inputRef}
                id="default-datepicker"
                type="date"
                className="bg-[#cfcfcf] border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg"
                placeholder="Select date"
            />
        </button>
      </div>
    </>
  );
}

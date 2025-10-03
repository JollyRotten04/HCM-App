import { useEffect } from "react";

declare const window: any;

export default function Dropdown() {
  useEffect(() => {
    // Reinitialize dropdowns after React renders
    if (window.initFlowbite) {
      window.initFlowbite();
    }
  }, []);

  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-black bg-[#cfcfcf] font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        inline-flex items-center"
        type="button"
      >
        Dropdown button
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        id="dropdown"
        className="z-10 hidden bg-[#cfcfcf] divide-y divide-gray-100 rounded-lg shadow-sm w-44"
      >
        <ul
          className="py-2 text-sm text-black"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div>
    </>
  );
}

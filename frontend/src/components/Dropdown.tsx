import React from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: string[] | DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, disabled }) => {
  const isObjectOptions = typeof options[0] === "object";

  return (
    <div className="relative inline-block w-full">
      <select
        className={`
          w-full appearance-none rounded-xl border border-gray-300 
          bg-white px-4 py-2 pr-10 text-sm shadow-sm 
          focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200
          hover:border-gray-400 transition
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt) =>
          isObjectOptions ? (
            <option key={(opt as DropdownOption).value} value={(opt as DropdownOption).value}>
              {(opt as DropdownOption).label}
            </option>
          ) : (
            <option key={opt as string} value={opt as string}>
              {opt as string}
            </option>
          )
        )}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-4 w-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4" />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;

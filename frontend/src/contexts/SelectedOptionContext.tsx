import { createContext, useContext, useState, ReactNode } from "react";

type SelectedOptionContextType = {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
};

const SelectedOptionContext = createContext<SelectedOptionContextType | undefined>(undefined);

export function SelectedOptionProvider({ children }: { children: ReactNode }) {
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  return (
    <SelectedOptionContext.Provider value={{ selectedOption, setSelectedOption }}>
      {children}
    </SelectedOptionContext.Provider>
  );
}

export function useSelectedOption() {
  const context = useContext(SelectedOptionContext);
  if (!context) {
    throw new Error("useSelectedOption must be used inside a SelectedOptionProvider");
  }
  return context;
}

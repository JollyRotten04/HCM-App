import { createContext, useState, useContext } from "react";

// Create the context
const KPIStatsContext = createContext();

// Context provider
export const KPIStatsProvider = ({ children }) => {
  const [employeeStats, setStatsContext] = useState(null);

  return (
    <KPIStatsContext.Provider value={{ employeeStats, setStatsContext }}>
      {children}
    </KPIStatsContext.Provider>
  );
};

// Hook for easy access
export const useKPIStats = () => useContext(KPIStatsContext);

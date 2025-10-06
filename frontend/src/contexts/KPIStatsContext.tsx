import { createContext, useState, useContext, type ReactNode } from "react";

// Define the shape of your context
interface KPIStats {
  summary?: {
    regularHoursCount?: number;
    overtimeCount?: number;
    undertimeCount?: number;
    lateCount?: number;
    nightDifferentialCount?: number;
    absentCount?: number;
    total?: number;
  };
  // Add more fields if your API returns more
}

interface KPIStatsContextType {
  employeeStats: KPIStats | null;
  setStatsContext: React.Dispatch<React.SetStateAction<KPIStats | null>>;
}

interface KPIStatsProviderProps {
  children: ReactNode;
}

// Create context with proper type
const KPIStatsContext = createContext<KPIStatsContextType | undefined>(undefined);

// Provider component
export const KPIStatsProvider = ({ children }: KPIStatsProviderProps) => {
  const [employeeStats, setStatsContext] = useState<KPIStats | null>(null);

  return (
    <KPIStatsContext.Provider value={{ employeeStats, setStatsContext }}>
      {children}
    </KPIStatsContext.Provider>
  );
};

// Hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useKPIStats = (): KPIStatsContextType => {
  const context = useContext(KPIStatsContext);
  if (!context) {
    throw new Error("useKPIStats must be used within a KPIStatsProvider");
  }
  return context;
};

import { createContext, useContext, useState, ReactNode } from "react";

type Metrics = {
  regularHours: number;
  overtime: number;
  nightDifferential: number;
  late: number;
  undertime: number;
};

type MetricsContextType = {
  allMetrics: Metrics; // aggregated totals
  setAllMetrics: (metrics: Metrics) => void;
};

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [allMetrics, setAllMetrics] = useState<Metrics>({
    regularHours: 0,
    overtime: 0,
    nightDifferential: 0,
    late: 0,
    undertime: 0,
  });

  return (
    <MetricsContext.Provider value={{ allMetrics, setAllMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used inside MetricsProvider");
  }
  return context;
}

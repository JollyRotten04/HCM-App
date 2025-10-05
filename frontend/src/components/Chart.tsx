import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useKPIStats } from "../contexts/KPIStatsContext";
import { useEffect, useState } from "react";

export default function Chart() {
  const { employeeStats } = useKPIStats();
  const [data, setData] = useState([]);

  useEffect(() => {
    console.group("Preparing KPI Metric Chart");

    if (!employeeStats) {
      // console.log("employeeStats is null or undefined");
      setData([]);
      console.groupEnd();
      return;
    }

    // console.log("employeeStats:", employeeStats);

    // Build chart data (one object with all metrics)
    const chartData = [
      {
        name: "KPI Metrics",
        "Regular Hours": employeeStats.summary?.regularHoursCount || 0,
        "Overtime": employeeStats.summary?.overtimeCount || 0,
        "Undertime": employeeStats.summary?.undertimeCount || 0,
        "Late": employeeStats.summary?.lateCount || 0,
        "Night Differential": employeeStats.summary?.nightDifferentialCount || 0,
      },
    ];

    setData(chartData);
    // console.log("Prepared chart data:", chartData);
    console.groupEnd();
  }, [employeeStats]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-4 border border-black">
      <h2 className="text-xl font-semibold text-center mb-4">KPI Overview</h2>
      {data.length === 0 ? (
        <p className="text-center">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Regular Hours" fill="#4caf50" />
            <Bar dataKey="Overtime" fill="#2196f3" />
            <Bar dataKey="Undertime" fill="#ff9800" />
            <Bar dataKey="Late" fill="#f44336" />
            <Bar dataKey="Night Differential" fill="#9c27b0" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

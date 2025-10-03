import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Monday", value: 68 },
  { name: "Tuesday", value: 5 },
  { name: "Wednesday", value: 8 },
  { name: "Thursday", value: 2 },
  { name: "Friday", value: 1 },
];

export default function Chart() {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-4 border border-black">
      <h2 className="text-xl font-semibold text-center mb-4">Daily Totals Over Workweek</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#B5CBB7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const userData = [
  { name: "Mon", users: 20 },
  { name: "Tue", users: 45 },
  { name: "Wed", users: 30 },
  { name: "Thu", users: 60 },
  { name: "Fri", users: 50 },
  { name: "Sat", users: 70 },
  { name: "Sun", users: 40 },
];

const reportStatusData = [
  { name: "Pending", value: 8 },
  { name: "Reviewed", value: 5 },
  { name: "Action Taken", value: 3 },
  { name: "Dismissed", value: 2 },
];

const COLORS = ["#facc15", "#4ade80", "#60a5fa", "#f87171"];

export default function Analytics() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users Bar Chart */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">📈 New Users This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reports Pie Chart */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">🚨 Report Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {reportStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

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
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const COLORS = ["#facc15", "#4ade80", "#60a5fa", "#f87171"];

export default function Analytics() {
  const [userData, setUserData] = useState([]);
  const [reportStatusData, setReportStatusData] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/analytics");
      setUserData(res.data.userStats || []);
      setReportStatusData(res.data.reportStats || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setUserData([]);
      setReportStatusData([]);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const socket = io();
    socket.on("analytics:update", fetchAnalytics);
    return () => socket.off("analytics:update", fetchAnalytics);
  }, []);

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gradient">
        📊 Admin Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users Bar Chart */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">📈 New Users This Week</h3>
          {userData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No user data available.</p>
          )}
        </div>

        {/* Reports Pie Chart */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            🚨 Report Status Distribution
          </h3>
          {reportStatusData.length > 0 ? (
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
          ) : (
            <p className="text-gray-500 text-sm">No report data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

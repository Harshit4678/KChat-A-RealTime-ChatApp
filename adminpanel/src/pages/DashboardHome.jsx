// DashboardHome.jsx
import { useEffect, useState } from "react";
import API from "../api/auth";
import GlassStatCard from "../components/GlassStatCard";
import LineChart from "../components/LineChart";
import { Doughnut } from "react-chartjs-2";
import {
  UsersIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion as Motion } from "framer-motion";

Chart.register(ArcElement, Tooltip, Legend);

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-10 bg-gray-100 dark:bg-gray-900"
    >
      {/* STAT CARDS */}
      <Motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <GlassStatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
          color="bg-blue-200"
        />
        <GlassStatCard
          title="Pending Reports"
          value={stats.pendingReports}
          icon={<ExclamationCircleIcon className="w-6 h-6 text-yellow-700" />}
          color="bg-yellow-200"
        />
        <GlassStatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={<NoSymbolIcon className="w-6 h-6 text-red-700" />}
          color="bg-red-100"
        />
      </Motion.div>

      {/* TREND CHARTS */}
      <Motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-screen-xl mx-auto"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="min-w-0">
          <LineChart
            title="Users Joined (Last 7 Days)"
            labels={stats.signupTrend.map((u) => u._id)}
            data={stats.signupTrend.map((u) => u.count)}
            color="#4F46E5"
          />
        </div>
        <div className="min-w-0">
          <LineChart
            title="Reports Received (Last 7 Days)"
            labels={stats.reportTrend.map((r) => r._id)}
            data={stats.reportTrend.map((r) => r.count)}
            color="#10B981"
          />
        </div>
      </Motion.div>

      {/* DOUGHNUT + ACTIVITY */}
      <Motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Doughnut Chart */}
        <Motion.div
          className="bg-white dark:bg-base-200 p-5 rounded-lg shadow max-h-[350px]"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-semibold mb-3">Report Status</h3>
          <Doughnut
            data={{
              labels: ["Pending", "Reviewed", "Dismissed"],
              datasets: [
                {
                  data: [
                    stats.pendingReports,
                    stats.reviewedReports || 0,
                    stats.dismissedReports || 0,
                  ],
                  backgroundColor: ["#FBBF24", "#3B82F6", "#EF4444"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </Motion.div>

        {/* Activity Timeline */}
        <Motion.div
          className="xl:col-span-2 bg-white dark:bg-base-200 p-5 rounded-lg shadow h-72 overflow-y-auto"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-sm">
            {stats.recentUsers?.length > 0 ? (
              stats.recentUsers.map((u, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></span>
                  <div>
                    <p>
                      <strong>{u.fullName}</strong> ({u.email}) signed up.
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No recent activity.</p>
            )}
          </ul>
        </Motion.div>
      </Motion.div>
    </Motion.div>
  );
}

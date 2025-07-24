import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
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

  if (loading) return <p className="text-lg">Loading stats...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={stats?.totalUsers}
        color="bg-blue-600"
      />
      <StatCard
        title="Pending Reports"
        value={stats?.pendingReports}
        color="bg-yellow-500"
      />
      <StatCard
        title="Blocked Users"
        value={stats?.blockedUsers}
        color="bg-red-600"
      />
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow-md ${color}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (userId) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/admin/users/${userId}/ban`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      console.log("Ban status:", res.data.user.isBanned);
      toast.success(
        `User is now ${res.data.user.isBanned ? "banned" : "unbanned"}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err.response || err);
      toast.error("Failed to update user");
    }
  };

  // Filter and sort users: matching userId first, then others
  let sortedUsers = users;
  if (searchId.trim()) {
    const match = users.find((u) => u._id === searchId.trim());
    sortedUsers = match
      ? [match, ...users.filter((u) => u._id !== searchId.trim())]
      : users;
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-3 py-2 rounded w-72"
        />
      </div>

      <table className="min-w-full bg-white border shadow rounded">
        <thead className="bg-gray-100 text-sm">
          <tr className="text-left">
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">User ID</th>
            <th className="p-3">Banned</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user._id} className="border-t text-sm hover:bg-gray-50">
              <td className="p-3">{user.fullName}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user._id}</td>
              <td className="p-3">
                {user.isBanned ? (
                  <span className="text-red-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-green-600 font-semibold">No</span>
                )}
              </td>
              <td className="p-3">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <button
                  onClick={() => toggleBan(user._id)}
                  className={`px-3 py-1 rounded text-white text-xs ${
                    user.isBanned
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Grid2X2, List, Ban, UserCheck, Search } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Failed to load users");
    }
  };

  const toggleBan = async (userId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/ban`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      toast.success(
        `User is now ${res.data.user.isBanned ? "banned" : "unbanned"}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "banned") return user.isBanned;
    if (filter === "unbanned") return !user.isBanned;
    return true;
  });

  const searchLower = search.trim().toLowerCase();

  const sortedUsers = searchLower
    ? [
        // Exact _id match
        ...filteredUsers.filter((u) => u._id === searchLower),
        // Name includes match (case-insensitive)
        ...filteredUsers.filter(
          (u) =>
            u._id !== searchLower &&
            u.fullName.toLowerCase().includes(searchLower)
        ),
      ]
    : filteredUsers;

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
          User Management
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset pagination
              }}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset pagination
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="banned">Banned Users</option>
            <option value="unbanned">Unbanned Users</option>
          </select>

          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg ${
              viewMode === "table"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Grid2X2 size={18} />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-indigo-100 text-gray-800 font-semibold">
              <tr>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-indigo-50 transition"
                >
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user._id}</td>
                  <td className="p-3">
                    {user.isBanned ? (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <Ban size={14} /> Banned
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <UserCheck size={14} /> Active
                      </span>
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
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedUsers.map((user) => (
            <Motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {user.fullName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1 break-all">{user._id}</p>
              <p className="mt-2 text-sm">
                Status:{" "}
                {user.isBanned ? (
                  <span className="text-red-600 font-medium">Banned</span>
                ) : (
                  <span className="text-green-600 font-medium">Active</span>
                )}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => toggleBan(user._id)}
                className={`mt-3 w-full py-1.5 text-sm rounded text-white ${
                  user.isBanned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {user.isBanned ? "Unban" : "Ban"}
              </button>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Motion.div>
  );
}

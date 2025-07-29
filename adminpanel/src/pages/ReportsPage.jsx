import { useState, useEffect, useRef } from "react";

import API from "../api/auth";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { decryptMessage } from "../utils/encryption";
import { motion as Motion } from "framer-motion";
import { FaEye, FaTrash, FaSort, FaThList, FaThLarge } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";

const statusOptions = ["pending", "reviewed", "dismissed", "action_taken"];
const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api/admin", "");
const getChatSecretKey = () => "shared-key-for-this-chat";

const ITEMS_PER_PAGE = 6;

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [lastMessages, setLastMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const socketRef = useRef(null);

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    if (!socketRef.current) {
      const socket = io(SOCKET_URL, { transports: ["websocket"] });
      socketRef.current = socket;
      socket.emit("admin-join");

      socket.on("new-report", (report) => {
        setReports((prev) => [report, ...prev]);
        toast.success("New report received!");
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    let data = [...reports];

    if (filterStatus !== "all") {
      data = data.filter((r) => r.status === filterStatus);
    }

    data.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === "asc"
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    });

    setFilteredReports(data);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [filterStatus, sortBy, sortOrder, reports]);

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusUpdate = async (reportId, newStatus) => {
    const adminNote = prompt("Enter admin note (optional):") || "";
    try {
      await API.patch(`/reports/${reportId}/status`, {
        status: newStatus,
        adminNote,
      });
      toast.success("Status updated");
      fetchReports();
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await API.delete(`/reports/${reportId}`);
      toast.success("Report deleted");
      fetchReports();
    } catch (err) {
      console.error("Error deleting report", err);
      toast.error("Delete failed");
    }
  };

  const handleViewLastMessages = async (report) => {
    try {
      const res = await API.get(
        `/users/${report.reportedUser._id}/last-messages?reporterId=${report.reportedBy._id}`
      );
      const secretKey = getChatSecretKey();
      const decryptedMsgs = res.data.map((msg) => ({
        ...msg,
        text: msg.text ? decryptMessage(msg.text, secretKey) : "",
        image: msg.image ? decryptMessage(msg.image, secretKey) : "",
      }));
      setLastMessages(decryptedMsgs);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching messages", err);
      toast.error("Failed to fetch messages");
    }
  };

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
          📢 Reported Users
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <MdOutlineFilterAlt className="text-xl text-gray-700" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-md border text-sm bg-white shadow-sm"
            >
              <option value="all">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-1 text-sm bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 transition"
          >
            <FaSort />
            Sort: {sortOrder}
          </button>

          <button
            onClick={() =>
              setViewMode((prev) => (prev === "table" ? "grid" : "table"))
            }
            className="flex items-center gap-1 text-sm bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 transition"
          >
            {viewMode === "table" ? <FaThLarge /> : <FaThList />}
            View: {viewMode}
          </button>
        </div>
      </div>

      {/* Reports View */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs font-bold uppercase tracking-wide text-left">
              <tr>
                <th className="p-3">Reporter</th>
                <th className="p-3">Reported</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Time</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-blue-600 font-medium">
                    {r.reportedBy?.fullName}
                  </td>
                  <td className="p-3 text-red-600">
                    {r.reportedUser?.fullName}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {r.reportedUser?._id}
                  </td>
                  <td className="p-3">
                    {r.messageId?.createdAt
                      ? new Date(r.messageId.createdAt).toLocaleString()
                      : "--"}
                  </td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "reviewed"
                          ? "bg-blue-100 text-blue-800"
                          : r.status === "dismissed"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(r._id, status)}
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        onClick={() => handleViewLastMessages(r)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <FaEye /> Last 10 Msgs
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedReports.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-lg p-4 shadow hover:shadow-md transition border"
            >
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Reported:</span>{" "}
                <span className="text-red-600">{r.reportedUser?.fullName}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Reporter:</strong> {r.reportedBy?.fullName}
                </p>
                <p>
                  <strong>User ID:</strong> {r.reportedUser?._id}
                </p>
                <p>
                  <strong>Reason:</strong> {r.reason}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{r.status}</span>
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewLastMessages(r)}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <FaEye className="inline mr-1" /> Last 5 Msgs
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Last 10 Messages
            </h3>
            <ul className="space-y-3 max-h-80 overflow-y-auto text-sm">
              {lastMessages.map((msg, i) => (
                <li key={i} className="border-b pb-2">
                  <div className="font-semibold text-blue-600">
                    {msg.senderId?.fullName || "Unknown"}
                  </div>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="img"
                      className="max-w-[120px] rounded my-1"
                    />
                  )}
                  {msg.text && <div>{msg.text}</div>}
                  <div className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Motion.div>
  );
}

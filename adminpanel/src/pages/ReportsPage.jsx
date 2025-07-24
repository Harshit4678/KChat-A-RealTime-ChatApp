import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const statusOptions = ["pending", "reviewed", "dismissed", "action_taken"];
const SOCKET_URL = "http://localhost:3000";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const socketRef = useRef(null);

  const handleViewLastMessages = (report) => {
    let details = {};
    try {
      details = JSON.parse(report.details || "{}");
    } catch {
      console.error("Failed to parse report details", report.details);
    }
    setLastMessages(details.last5 || []);
    setShowModal(true);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3000/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Connect socket only once
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, { transports: ["websocket"] });
      socketRef.current = socket;

      // Identify as admin
      socket.emit("admin-join");

      socket.on("new-report", (report) => {
        // Option 1: Fetch all reports again (safe)
        fetchReports();
        // Option 2: Just add new report to top (faster, but may miss updates)
        setReports((prev) => [report, ...prev]);
        toast.success("New report received!");
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    const adminNote = prompt("Enter admin note (optional):") || "";
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/reports/${reportId}/status`,
        { status: newStatus, adminNote },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Status updated");
      fetchReports();
    } catch (err) {
      toast.error("Failed to update", err);
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Report deleted");
      fetchReports();
    } catch (err) {
      toast.error("Delete failed", err);
    }
  };

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Reported Messages</h2>
      <table className="min-w-full bg-white border shadow rounded">
        <thead className="bg-gray-100 text-sm">
          <tr className="text-left">
            <th className="p-3">Reporter</th>
            <th className="p-3">Reported</th>
            <th className="p-3">User ID</th>
            <th className="p-3">Message Time</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Reported At</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-t text-sm hover:bg-gray-50">
              <td className="p-3 text-blue-600">{r.reportedBy?.fullName}</td>
              <td className="p-3 text-red-600">{r.reportedUser?.fullName}</td>
              <td className="p-3">{r.reportedUser?._id || ""}</td>
              <td className="p-3 max-w-sm truncate">
                {(() => {
                  let details = {};
                  try {
                    details = JSON.parse(r.details || "{}");
                  } catch {
                    console.error("Failed to parse report details", r.details);
                  }
                  return (
                    <>
                      {details.image && (
                        <img
                          src={details.image}
                          alt="attachment"
                          className="max-w-[120px] mb-1 rounded"
                        />
                      )}
                      {details.text || (
                        <span className="italic text-gray-400">[No Text]</span>
                      )}
                    </>
                  );
                })()}
              </td>
              <td className="p-3">
                {new Date(r.messageId?.createdAt).toLocaleString()}
              </td>
              <td className="p-3">{r.reason}</td>
              <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : r.status === "reviewed"
                      ? "bg-blue-200 text-blue-800"
                      : r.status === "dismissed"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="p-3 space-y-1">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(r._id, status)}
                    className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 mr-1"
                  >
                    {status}
                  </button>
                ))}

                <button
                  onClick={() => handleViewLastMessages(r)}
                  className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  View Last 5 Msgs
                </button>
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                      <h3 className="text-lg font-bold mb-4">
                        Last 5 Messages
                      </h3>
                      <ul className="space-y-2 max-h-80 overflow-y-auto">
                        {lastMessages.map((msg, idx) => (
                          <li key={idx} className="border-b pb-2">
                            {msg.image && (
                              <img
                                src={msg.image}
                                alt="attachment"
                                className="max-w-[120px] mb-1 rounded"
                              />
                            )}
                            <div>
                              {msg.text || (
                                <span className="italic text-gray-400">
                                  [No Text]
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleString()
                                : ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <button
                        className="mt-4 btn btn-sm btn-error"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

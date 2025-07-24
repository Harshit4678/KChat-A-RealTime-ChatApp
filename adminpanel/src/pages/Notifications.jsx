import { useState } from "react";
import { BellRing, Flag, UserX, MessageCircleWarning } from "lucide-react";

const dummyNotifications = [
  {
    id: 1,
    type: "report",
    title: "New Report Submitted",
    message: "User John Doe reported a message.",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "ban",
    title: "User Banned",
    message: "Admin banned user Jane Smith.",
    time: "10 minutes ago",
  },
  {
    id: 3,
    type: "message",
    title: "Suspicious Message",
    message: "Flagged message by user David.",
    time: "1 hour ago",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "report":
      return <Flag className="text-red-500" />;
    case "ban":
      return <UserX className="text-yellow-500" />;
    case "message":
      return <MessageCircleWarning className="text-blue-500" />;
    default:
      return <BellRing className="text-gray-400" />;
  }
};

export default function Notifications() {
  const [notifications] = useState(dummyNotifications);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
      <div className="space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="flex items-start gap-4 bg-white p-4 rounded shadow"
          >
            <div className="mt-1">{getIcon(note.type)}</div>
            <div>
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.message}</p>
              <span className="text-xs text-gray-400">{note.time}</span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications found.</p>
        )}
      </div>
    </div>
  );
}

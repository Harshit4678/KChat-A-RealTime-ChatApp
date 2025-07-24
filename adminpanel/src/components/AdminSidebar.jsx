import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  Users,
  MessageSquare,
  MessageCircle,
  BarChart3,
  Settings,
  Bell,
  ScrollText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard /> },
  { label: "Reports", to: "/dashboard/reports", icon: <Flag /> },
  { label: "Users", to: "/dashboard/users", icon: <Users /> },

  { label: "Feedback", to: "/dashboard/feedback", icon: <MessageCircle /> },
  { label: "Analytics", to: "/dashboard/analytics", icon: <BarChart3 /> },
  { label: "Settings", to: "/dashboard/settings", icon: <Settings /> },
  { label: "Logs", to: "/dashboard/logs", icon: <ScrollText /> },
  { label: "Notifications", to: "/dashboard/notifications", icon: <Bell /> },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-4">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav className="flex flex-col gap-4">
        {navItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition-all ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  Bell,
  ScrollText,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Reports", to: "/dashboard/reports", icon: <Flag size={20} /> },
  { label: "Users", to: "/dashboard/users", icon: <Users size={20} /> },
  {
    label: "Feedback",
    to: "/dashboard/feedback",
    icon: <MessageCircle size={20} />,
  },
  {
    label: "Analytics",
    to: "/dashboard/analytics",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
  { label: "Logs", to: "/dashboard/logs", icon: <ScrollText size={20} /> },
  {
    label: "Notifications",
    to: "/dashboard/notifications",
    icon: <Bell size={20} />,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white shadow-lg border-r border-white/10 z-50">
      <Motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6 px-4 border-b border-white/10"
      >
        <h1 className="text-3xl font-extrabold tracking-wider text-white leading-tight">
          KChat<span className="text-indigo-400"> Admin</span>
        </h1>
        <p className="text-sm text-indigo-200 mt-1 italic">
          Connecting Conversations, Powering Moderation
        </p>
      </Motion.div>

      <nav className="flex flex-col gap-2 px-4">
        {navItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "hover:bg-white/10 hover:text-indigo-300"
              }`
            }
          >
            <span className="text-indigo-300">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

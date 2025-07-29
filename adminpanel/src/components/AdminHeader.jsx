import { useAdminStore } from "../store/useAdminStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, UserCircle } from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 ml-64 bg-gradient-to-r from-indigo-900 via-purple-900 to-black shadow-lg border-b border-white/10 z-40 relative">
      <h2 className="text-xl font-semibold text-white tracking-wide">
        Welcome, <span className="text-indigo-300">{admin?.fullName}</span>
      </h2>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer group">
          <Bell
            className="text-indigo-200 hover:text-white transition duration-200"
            size={22}
          />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-indigo-600 px-3 py-1.5 rounded-md cursor-pointer transition-all text-indigo-200 hover:text-white"
          >
            <UserCircle size={22} />
            <div className="relative">
              <span className="text-sm">{admin?.fullName.split(" ")[0]}</span>
              {/* Online status */}
              <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {admin?.fullName}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {admin?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600/20 dark:text-red-400 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, User, Menu } from "lucide-react";

const Navbar = ({ setIsSidebarOpen }) => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Logo + Slogan */}
          <div className="flex items-center gap-6">
            {/* Sidebar Toggle */}
            <button
              className="btn btn-sm btn-circle sm:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <Menu size={20} />
            </button>

            {/* Brand Logo + Slogan */}
            <Link
              to="/"
              className="flex items-center gap-3 group transition-all duration-300"
            >
              {/* Text + Slogan */}
              <div className="flex flex-col leading-tight group relative">
                {/* KChat wrapper with tight glow container */}
                <div className="relative inline-flex items-center gap-[2px] px-1 py-0.5 z-10 overflow-visible">
                  {/* Glow ring ONLY around KChat */}
                  <div className="absolute inset-0 rounded-lg blur-md opacity-10 bg-gradient-to-r from-primary to-accent scale-105 pointer-events-none -z-10" />

                  {/* Pulsing K */}
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-md font-black text-base sm:text-lg leading-none transform transition-transform group-hover:scale-105 animate-pulse ">
                    K
                  </span>

                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg sm:text-xl font-bold transition-all duration-300 group-hover:brightness-110 animate-pulse">
                    Chat
                  </span>
                </div>

                <span className="mt-1 text-[0.7rem] sm:text-xs text-base-content/60 font-medium tracking-wide hidden sm:block group-hover:opacity-80 transition-opacity">
                  Where real-time meets real people
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {authUser && (
              <>
                {/* Settings Button */}
                <button
                  type="button"
                  className="btn btn-sm px-3 gap-2 shadow-sm"
                  onClick={() => {
                    if (location.pathname === "/settings") {
                      navigate(-1);
                    } else {
                      navigate("/settings");
                    }
                  }}
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
                {/* Profile Button */}
                <button
                  type="button"
                  className="btn btn-sm px-2 gap-2 min-w-[42px] shadow-sm"
                  onClick={() => {
                    if (location.pathname === "/profile") {
                      navigate(-1); // Go back if already on profile
                    } else {
                      navigate("/profile");
                    }
                  }}
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover border border-base-300"
                  />
                  <span className="hidden sm:inline font-medium max-w-[120px] truncate">
                    {authUser.fullName}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="btn btn-sm px-3 gap-2 shadow-sm"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

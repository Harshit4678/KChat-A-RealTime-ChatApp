import { useAdminStore } from "../store/useAdminStore";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const admin = useAdminStore((s) => s.admin);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 ml-64">
      <h2 className="text-xl font-semibold">Welcome, {admin?.fullName}</h2>
      <button
        onClick={logout}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Logout
      </button>
    </header>
  );
}

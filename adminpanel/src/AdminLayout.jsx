import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-800 dark:text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-1 ml-64">
        <AdminHeader />
        <main className="p-6 md:p-10 mt-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

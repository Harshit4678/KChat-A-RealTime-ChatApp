import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminHeader />
        <main className="p-6 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

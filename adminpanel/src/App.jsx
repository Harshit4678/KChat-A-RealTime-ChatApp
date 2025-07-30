import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./pages/DashboardHome";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";

import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";
import Notifications from "./pages/Notifications";

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAdminStore } from "./store/useAdminStore";
import API from "./api/auth";

export default function App() {
  const setAdmin = useAdminStore((s) => s.setAdmin);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      API.get("/me")
        .then((res) => setAdmin(res.data.admin))
        .catch(() => setAdmin(null));
    }
  }, [setAdmin]);
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/logs" element={<Logs />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />

          <Route path="*" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

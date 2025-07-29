import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import { useAdminStore } from "../store/useAdminStore";
import { motion as Motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const setAdmin = useAdminStore((state) => state.setAdmin);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAdmin(form.email, form.password);
      setAdmin(data.admin);
      localStorage.setItem("adminToken", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      <div className="absolute top-6 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-wider drop-shadow-lg">
          KChat <span className="text-indigo-200">Admin</span>
        </h1>
        <p className="text-sm text-white/80 italic mt-1">
          Connecting Conversations, Powering Moderation
        </p>
      </div>
      <Motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg text-white"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white font-semibold hover:brightness-110 transition duration-200 shadow-md"
        >
          Login
        </button>

        <p className="text-center text-xs text-white/70 mt-4">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </Motion.form>
    </div>
  );
}

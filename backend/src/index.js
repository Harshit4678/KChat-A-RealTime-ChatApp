// Load env first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import adminRoutes from "./routes/admin.route.js";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://klikchat-2025.vercel.app",
      "https://k-chat-admin-panel.vercel.app",
    ],
    credentials: true,
  })
);

// Debugging route for cookie check
app.get("/api/ping", (req, res) => {
  const token = req.cookies.jwt;
  res.json({
    message: "pong",
    token: token || "No cookie found",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`);
  connectDB();
});

// filepath: c:\Users\Harshit\OneDrive\Desktop\Web development\CODE WITH HARRY\React course\REACT Projects\chatting webApp\backend\src\index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(express.json({ limit: "20mb" })); // Increase the limit to 10MB

// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

server.listen(PORT, () => {
  console.log("Server is running on port :" + PORT);
  connectDB();
});

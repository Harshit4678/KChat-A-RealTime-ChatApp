import { Server } from "socket.io";
import http from "http";
import express from "express";
import Report from "../models/Report.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // frontend dev
      "http://localhost:5174", // admin panel dev
      "https://app.klikchat.fun",
      "https://klikchat-2025.vercel.app", // frontend prod
      "https://k-chat-admin-panel.vercel.app", // admin panel prod
    ],
    credentials: true,
  },
});

// Map to track online users (userId -> socketId)
const userSocketMap = {};

// Set to track admin sockets
const adminSockets = new Set();

// Utility function
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Admin joins
  socket.on("admin-join", () => {
    adminSockets.add(socket.id);
  });

  // Typing indicators (1-to-1)
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("showTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("hideTyping", { senderId });
    }
  });

  // WebRTC: Call Offer
  socket.on("call-offer", ({ to, from, offer }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-offer", { from, offer });
    }
  });

  // WebRTC: Call Answer
  socket.on("call-answer", ({ to, answer }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-answer", { answer });
    }
  });

  // WebRTC: ICE Candidate
  socket.on("ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", { candidate });
    }
  });

  // WebRTC: Call Ended
  socket.on("call-ended", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    }
  });

  // WebRTC: Call Declined
  socket.on("call-declined", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-declined");
    }
  });

  // Report a message
  socket.on(
    "report-message",
    async ({ reportedUserId, messageId, reason, details, reportedBy }) => {
      try {
        const report = await Report.create({
          reportedBy,
          reportedUser: reportedUserId,
          messageId,
          reason,
          details: details || "",
        });
        console.log("📩 Message reported:", messageId);

        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("new-report", report);
        });
      } catch (error) {
        console.error("❌ Error reporting message:", error);
      }
    }
  );

  // Report a user
  socket.on(
    "report-user",
    async ({ reportedUserId, reason, details, reportedBy }) => {
      try {
        const report = await Report.create({
          reportedBy,
          reportedUser: reportedUserId,
          messageId: null,
          reason,
          details: details || "",
        });
        console.log("⚠️ User reported:", reportedUserId);

        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("new-report", report);
        });
      } catch (error) {
        console.error("❌ Error reporting user:", error);
      }
    }
  );

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log("🚫 Disconnected:", socket.id);

    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      io.emit("user-disconnected", { userId: disconnectedUserId });
    }

    adminSockets.delete(socket.id);
  });
});

export { io, app, server };

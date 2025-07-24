import { Server } from "socket.io";
import http from "http";
import express from "express";

import Report from "../models/Report.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Maintain a set of admin sockets
const adminSockets = new Set();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Listen for admin joining
  socket.on("admin-join", () => {
    adminSockets.add(socket.id);
  });
  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      // Notify other users if there was an active call
      io.emit("user-disconnected", { userId });
    }
    adminSockets.delete(socket.id);
  });

  // Video call signaling
  socket.on("call-offer", ({ to, from, offer }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-offer", { from, offer });
    }
  });
  socket.on("call-answer", ({ to, answer }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-answer", { answer });
    }
  });
  socket.on("ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", { candidate });
    }
  });

  socket.on("call-ended", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    }
  });

  // Handle call declined
  socket.on("call-declined", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-declined");
    }
  });

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
        console.log("Message reported:", messageId);

        // Notify all admins in real-time
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("new-report", report);
        });
      } catch (err) {
        console.error("Error reporting message", err);
      }
    }
  );

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
        console.log("User reported:", reportedUserId);

        // Notify all admins in real-time
        adminSockets.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("new-report", report);
        });
      } catch (err) {
        console.error("Error reporting user", err);
      }
    }
  );
});

export { io, app, server };

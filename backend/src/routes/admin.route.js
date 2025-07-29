import express from "express";
import {
  adminLogin,
  getAdminProfile,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getDashboardStats,
  getAllUsers,
  getAllMessages,
  toggleUserBan,
  getLastMessagesOfUser,
  updateAdmin,
  getAnalytics,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public Admin Route
router.post("/login", adminLogin);
router.get("/me", verifyAdmin, getAdminProfile);
router.put("/update/:id", updateAdmin);

// Reports
router.get("/reports", verifyAdmin, getAllReports);
router.patch("/reports/:id/status", verifyAdmin, updateReportStatus);
router.delete("/reports/:id", verifyAdmin, deleteReport);
router.get("/users/:userId/last-messages", verifyAdmin, getLastMessagesOfUser);

// Users
router.get("/users", verifyAdmin, getAllUsers);
router.patch("/users/:userId/ban", verifyAdmin, toggleUserBan);

// Messages
router.get("/messages", verifyAdmin, getAllMessages);

// Dashboard stats
router.get("/stats", verifyAdmin, getDashboardStats);

router.get("/analytics", getAnalytics);

export default router;

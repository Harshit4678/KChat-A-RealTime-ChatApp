import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Report from "../models/Report.model.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 86400000,
    });

    res.status(200).json({
      message: "Login successful",
      admin: { email: admin.email, fullName: admin.fullName },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// GET ALL REPORTS
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "fullName email")
      .populate("reportedUser", "fullName email")
      .populate("messageId", "text createdAt senderId")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// UPDATE REPORT STATUS
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        status,
        adminNote,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ message: "Failed to update report status" });
  }
};

// DELETE REPORT
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report" });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "fullName email isBanned createdAt");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// BAN / UNBAN USER
export const toggleUserBan = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({ user }); // 👈 Return the updated user object
};

export const takeActionOnReport = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const report = await Report.findById(id);
  if (!report) return res.status(404).json({ error: "Report not found" });

  if (action === "block") {
    // block logic here
    await User.findByIdAndUpdate(report.reportedUser, { isBlocked: true });
    report.status = "reviewed";
  } else if (action === "dismiss") {
    report.status = "dismissed";
  } else if (action === "reviewed") {
    report.status = "reviewed";
  }

  await report.save();
  res.json({ success: true });
};

// GET ALL MESSAGES
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("senderId", "fullName")
      .populate("receiverId", "fullName")
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const blockedUsers = await User.countDocuments({ isBanned: true });
    res.status(200).json({ totalUsers, pendingReports, blockedUsers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const getLastMessagesOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    // Find last N messages sent by this user (as sender)
    const messages = await Message.find({ senderId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("text image createdAt")
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

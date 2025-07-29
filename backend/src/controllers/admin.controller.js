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

// Dashboard Stats with trend data
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const blockedUsers = await User.countDocuments({ isBanned: true });
    const reviewedReports = await Report.countDocuments({ status: "reviewed" });
    const dismissedReports = await Report.countDocuments({
      status: "dismissed",
    });

    const userSignupTrend = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const reportTrend = await Report.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("fullName email createdAt");

    res.status(200).json({
      totalUsers,
      pendingReports,
      blockedUsers,
      reviewedReports,
      dismissedReports,
      signupTrend: userSignupTrend,
      reportTrend,
      recentUsers,
    });
  } catch (err) {
    console.error("Failed to fetch dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const getLastMessagesOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reporterId } = req.query;
    const limit = 5;

    // 5 messages sent by reported user to reporter
    const sentByReported = await Message.find({
      senderId: userId,
      receiverId: reporterId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "fullName")
      .lean();

    // 5 messages sent by reporter to reported user
    const sentByReporter = await Message.find({
      senderId: reporterId,
      receiverId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "fullName")
      .lean();

    const last10 = [...sentByReported, ...sentByReporter]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json(last10);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    // req.admin verifyAdmin middleware se aata hai
    const admin = await Admin.findById(req.admin.id).select("email fullName");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.fullName = fullName || admin.fullName;
    admin.email = email || admin.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.status(200).json({ message: "Admin updated", admin });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 6);

    // User Signups (past 7 days)
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: pastWeek },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%a", date: "$createdAt" }, // e.g., "Mon"
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const orderedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const userData = orderedDays.map((day) => {
      const stat = userStats.find((d) => d._id === day);
      return { date: day, count: stat?.count || 0 };
    });

    // Report Status
    const statusCounts = await Report.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]);

    console.log("Status Counts:", statusCounts);

    const reportData = [
      { name: "Pending", value: 0 },
      { name: "Reviewed", value: 0 },
      { name: "Action Taken", value: 0 },
      { name: "Dismissed", value: 0 },
    ];

    statusCounts.forEach((item) => {
      const index = reportData.findIndex((r) => r.name === item._id);
      if (index !== -1) reportData[index].value = item.value;
    });

    res.json({ userStats: userData, reportStats: reportData });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error in analytics" });
  }
};

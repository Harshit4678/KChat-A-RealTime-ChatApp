import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Message from "../models/message.model.js";
import crypto from "crypto";
import { sendEmail } from "../lib/sendEmail.js";
import validator from "validator";
import PendingUser from "../models/pendingUser.model.js";

import { OAuth2Client } from "google-auth-library"; // 👈 NEW IMPORT

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // 👈 NEW CLIENT

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    // Check if user already exists (verified)
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Remove any previous pending user for this email
    await PendingUser.deleteMany({ email: email.toLowerCase() });

    // Generate OTP and verification token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 10; // 10 min
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 min

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to PendingUser
    await PendingUser.create({
      fullName,
      email: email.toLowerCase(),
      hashedPassword,
      otp,
      otpExpiry,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
    await sendEmail(
      email,
      "Verify your email",
      `<p>Your OTP is <b>${otp}</b></p>
      <p>Or click <a href="${verifyUrl}">here</a> to verify your email. This link and OTP will expire in 10 minutes.</p>`
    );

    res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending)
      return res.status(400).json({ message: "No pending verification found" });

    // Check OTP or token
    const now = Date.now();
    let valid = false;
    if (otp && pending.otp === otp && pending.otpExpiry > now) valid = true;
    if (
      token &&
      pending.verificationToken === token &&
      pending.verificationTokenExpiry > now
    )
      valid = true;

    if (!valid)
      return res.status(400).json({ message: "Invalid or expired OTP/link" });

    // Double check: user already exists?
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = await User.create({
      fullName: pending.fullName,
      email: pending.email,
      password: pending.hashedPassword,
      isVerified: true,
    });

    // Remove pending user
    await PendingUser.deleteOne({ _id: pending._id });

    res.status(201).json({
      message: "Email verified and account created!",
      user: { email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending)
      return res.status(400).json({ message: "No pending verification found" });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 10; // 10 min

    pending.otp = otp;
    pending.otpExpiry = otpExpiry;
    await pending.save();

    await sendEmail(
      email,
      "Your new OTP",
      `<p>Your new OTP is <b>${otp}</b></p>`
    );

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid email or not registered!" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });

    if (user.isBanned)
      return res.status(403).json({ message: "You are banned by admin." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password!" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token missing" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = await User.create({
        fullName: name,
        email: email.toLowerCase(),
        profilePic: picture || "https://example.com/default-avatar.png",
        password: randomPassword,
        googleId: sub,
        isVerified: true,
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 10;
    await user.save();

    await sendEmail(
      user.email,
      "Your OTP for password reset",
      `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const verifyOtpForReset = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (!newPassword || newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "internal Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    // Optionally, delete all messages associated with the user
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }
    if (fullName) {
      updateData.fullName = fullName;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.isBanned) {
      return res.status(403).json({
        message:
          "You are banned by admin for some kind of suspicious activity or for abusing.",
        adminEmail: "admin@example.com",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

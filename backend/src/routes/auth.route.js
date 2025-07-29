import express from "express";
import {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  updateProfile,
  deleteAccount,
  checkAuth,
  resendOtp,
  verifyOtpForReset,
  resetPasswordWithOtp,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyOtpForReset);
router.post("/reset-password-otp", resetPasswordWithOtp);

router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);
router.get("/check", protectRoute, checkAuth);

export default router;

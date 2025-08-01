import { useState } from "react";
import { axiosIntance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    try {
      await axiosIntance.post("/auth/forgot-password", {
        email: email.toLowerCase(),
      });
      toast.success("OTP sent to your email.");
      setStep(2);
      setResendTimer(30);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      await axiosIntance.post("/auth/verify-reset-otp", { email, otp });
      toast.success("OTP verified! Set new password.");
      setStep(3);
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axiosIntance.post("/auth/reset-password-otp", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successful! You can now login.");
      setResetMsg("Password reset successful! Please login.");
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axiosIntance.post("/auth/forgot-password", { email });
      toast.success("OTP resent to your email.");
      setResendTimer(30);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Resend OTP error:", err);

      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 font-sans px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Orb */}
      <div className="absolute top-6 left-6 w-28 h-28 bg-gradient-to-br from-purple-400 to-blue-300 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse" />

      <Motion.div
        className="w-full max-w-md space-y-6 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Logo + Heading */}
        <div className="text-center flex flex-col items-center gap-6">
          <Motion.div
            className="flex flex-col items-center gap-4 group"
            whileHover={{ scale: 1.04 }}
          >
            <div className="relative z-10 group flex items-center gap-1">
              <h1 className="text-2xl font-bold font-serif text-primary">
                Forgot Password
              </h1>
              <div className="absolute inset-0 rounded-xl blur-lg opacity-10 z-0 bg-gradient-to-r from-primary to-accent scale-110" />
            </div>

            <p className="text-gray-500 text-sm -mt-2">
              Enter your email to receive OTP
            </p>
          </Motion.div>
        </div>

        {/* FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-11 py-3 rounded-lg bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn w-full py-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 text-white font-semibold shadow-md hover:shadow-lg transition-all animate-pulse"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full py-3 rounded-lg bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="btn w-full py-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 text-white font-semibold shadow-md hover:shadow-lg animate-pulse"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                resendTimer > 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-blue-600 animate-bounce"
              }`}
            >
              Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
            </button>
            {otpMsg && <p className="text-sm text-red-500">{otpMsg}</p>}
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full py-3 rounded-lg bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full py-3 rounded-lg bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <ul className="text-sm text-gray-500 mb-2 space-y-1 pl-5 list-disc">
              <li>At least 6 characters</li>
              <li>Use uppercase & lowercase letters</li>
              <li>Include numbers & special characters</li>
            </ul>
            <button
              type="submit"
              className="btn w-full py-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-400 text-white font-semibold shadow-md hover:shadow-lg"
            >
              Reset Password
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-green-600 font-medium">{resetMsg}</p>
            <a
              href="/login"
              className="inline-block bg-gradient-to-br from-purple-500 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg animate-bounce"
            >
              Go to Login
            </a>
          </div>
        )}
      </Motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

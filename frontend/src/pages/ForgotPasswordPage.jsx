import { useState } from "react";
import { axiosIntance } from "../lib/axios.js";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Step 1: Send OTP
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

  // Step 2: Verify OTP
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

  // Step 3: Reset Password
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

  // Resend OTP
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
      console.log(err);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full">
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full">
              Verify OTP
            </button>
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
            >
              Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
            </button>
            <p className="text-red-500">{otpMsg}</p>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="input input-bordered w-full"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="input input-bordered w-full"
            />
            <ul className="text-sm text-gray-500 mb-2">
              <li>• At least 6 characters</li>
              <li>• Use uppercase & lowercase letters</li>
              <li>• Use numbers & special characters</li>
            </ul>
            <button type="submit" className="btn btn-primary w-full">
              Reset Password
            </button>
          </form>
        )}
        {step === 4 && (
          <div>
            <p className="text-green-600 font-semibold mb-4">{resetMsg}</p>
            <a href="/login" className="btn btn-primary w-full">
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

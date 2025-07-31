import { useState } from "react";
import { axiosIntance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { isSigningUp, setAuthUser } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const res = await axiosIntance.post("/auth/signup", formData);
        toast.success(res.data.message || "Account created successfully!");
        setOtpEmail(formData.email);
        setShowOtpScreen(true);
        setResendTimer(30);
        // Start timer for resend button
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create account"
        );
      }
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axiosIntance.post("/auth/verify-email", {
        email: otpEmail,
        otp,
      });
      setOtpMsg(res.data.message);
      toast.success("Email verified! Redirecting...");
      // Get user profile from backend
      const userRes = await axiosIntance.post("/auth/login", {
        email: otpEmail,
        password: formData.password,
      });
      setAuthUser(userRes.data); // Set user in store
      navigate("/"); // Redirect to home
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
  };
  const handleResendOtp = async () => {
    try {
      await axiosIntance.post("/auth/resend-otp", { email: otpEmail });
      toast.success("OTP resent to your email.");
      setResendTimer(30);
      // Start timer again
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

  // OTP screen logic START
  if (showOtpScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-2">
          Email: <b>{otpEmail}</b>
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="input input-bordered w-full max-w-xs mb-2"
        />
        <button
          className="btn btn-primary w-full max-w-xs mb-2"
          onClick={handleVerifyOtp}
        >
          Verify OTP
        </button>
        <button
          className="btn btn-secondary w-full max-w-xs"
          onClick={handleResendOtp}
          disabled={resendTimer > 0}
        >
          Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
        </button>
        <p className="mt-2">{otpMsg}</p>
        <p className="mt-2 text-sm text-gray-500">
          Or check your email for the verification link.
        </p>
      </div>
    );
  }
  // OTP screen logic END
  return (
    <div className="min-h-screen flex justify-center items-start pt-32 sm:pt-24 px-4 sm:px-6 bg-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-2 group">
            <div className="relative z-10 group flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary to-accent text-white font-black text-2xl leading-none transform transition-transform group-hover:scale-105 animate-bounce-pulse">
                K
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                Chat
              </span>
              <div className="absolute inset-0 rounded-xl blur-lg opacity-30 z-0 bg-gradient-to-r from-primary to-accent scale-110" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free Account
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="form-control">
            <label className="label font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-base-content/40 size-5" />
              <input
                type="text"
                className="input input-bordered w-full pl-12"
                placeholder="Full Name"
                value={formData.fullName}
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-base-content/40 size-5" />
              <input
                type="text"
                className="input input-bordered w-full pl-12"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-base-content/40 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-12 pr-10"
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

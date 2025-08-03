import { useState, useEffect, useRef } from "react";
import { axiosIntance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import OtpInput from "../components/OtpInput.jsx";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpMsg, setOtpMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { isSigningUp, setAuthUser } = useAuthStore();
  const orbRef = useRef(null);

  useEffect(() => {
    gsap.to(orbRef.current, {
      y: -15,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

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
    if (!validateForm()) return;
    try {
      const res = await axiosIntance.post("/auth/signup", formData);
      toast.success(res.data.message || "Account created successfully!");
      setOtpEmail(formData.email);
      setShowOtpScreen(true);
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpValue = otp.map((d) => d.trim()).join("");

      const res = await axiosIntance.post("/auth/verify-email", {
        email: otpEmail,
        otp: otpValue,
      });
      setOtpMsg(res.data.message);
      toast.success("Email verified! Redirecting...");
      const userRes = await axiosIntance.post("/auth/login", {
        email: otpEmail,
        password: formData.password,
      });
      setAuthUser(userRes.data);
      navigate("/");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axiosIntance.post("/auth/resend-otp", { email: otpEmail });
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
      console.error(err);
      toast.error("Failed to resend OTP");
    }
  };

  if (showOtpScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="backdrop-blur-xl  rounded-2xl p-6 sm:p-10 max-w-md w-full space-y-6 animate-fade-in-up">
          <div className="flex flex-col items-center space-y-3">
            {/* <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold animate-spin-slow">
              <ShieldCheck className="w-6 h-6" />
            </span> */}

            <h2 className="text-2xl sm:text-2xl font-semibold text-primary font-serif animate-pulse">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 text-center">
              We’ve sent a code to{" "}
              <span className="text-gray-900 font-medium">{otpEmail}</span>
            </p>
          </div>

          <OtpInput value={otp} onChange={setOtp} />

          <button
            onClick={handleVerifyOtp}
            disabled={otp.join("").length !== 6}
            className="w-full py-2 bg-gradient-to-br from-purple-500 to-blue-400 text-white font-semibold rounded-lg transition-all hover:scale-[1.02]"
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0}
            className={`w-full py-3 rounded-lg bottom-1 font-semibold transition ${
              resendTimer > 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-blue-600 animate-bounce"
            }`}
          >
            Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
          </button>

          {otpMsg && (
            <p className="text-sm text-red-500 text-center">{otpMsg}</p>
          )}

          <p className="text-xs text-gray-500 text-center">
            Or check your email for the verification link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 sm:pt-20 md:pt-28 flex items-center justify-center bg-white text-gray-800 font-sans px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        ref={orbRef}
        className="absolute top-6 left-6 w-28 h-28 bg-gradient-to-br from-purple-400 to-blue-300 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse"
      />
      <Motion.div
        className="w-full max-w-md space-y-6 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-6">
          <Motion.div
            className="flex flex-col items-center gap-4 group"
            whileHover={{ scale: 1.04 }}
          >
            <div className="relative z-10 group flex items-center gap-1">
              {/* K with pulse */}
              <span className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white font-black text-xl sm:text-2xl leading-none transform transition-transform group-hover:scale-105 animate-bounce-pulse">
                K
              </span>

              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110 animate-pulse">
                LikChat
                <span className="absolute -top-1 text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110 animate-bounce-pulse">
                  💬
                </span>
              </span>

              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl blur-lg opacity-20 z-0 bg-gradient-to-r from-primary to-accent scale-110" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-primary">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm -mt-2">
              Get started with your free account
            </p>
          </Motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="form-control">
            <label className="label text-gray-700 font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type="text"
                maxLength={20}
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input input-bordered w-full pl-11 py-3 rounded-lg bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label text-gray-700 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                className="input input-bordered w-full pl-11 py-3 rounded-lg bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label text-gray-700 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input input-bordered w-full pl-11 pr-10 py-3 rounded-lg bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-gray-400" />
                ) : (
                  <Eye className="size-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Motion.button
            type="submit"
            disabled={isSigningUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-full font-semibold tracking-wide py-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 text-white shadow-md hover:shadow-lg transition relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-5 blur-sm animate-pulse z-0" />
          </Motion.button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Sign In
          </Link>
        </div>
      </Motion.div>
    </div>
  );
};

export default SignUpPage;

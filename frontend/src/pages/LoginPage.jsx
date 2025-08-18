import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { motion as Motion } from "framer-motion";

import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 font-sans px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-0 md:pt-20">
      {/* Floating Orb */}
      <div className="absolute top-6 left-6 w-28 h-28 bg-gradient-to-br from-purple-400 to-blue-300 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse" />

      <Motion.div
        className="w-full max-w-md space-y-4 z-10"
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
              Login
            </h1>
            <p className="text-gray-500 text-sm -mt-2">
              Login to your account to continue
            </p>
          </Motion.div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(formData);
          }}
          className="space-y-2"
          autoComplete="off"
        >
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
                className="input input-bordered w-full pl-11 py-3 rounded-lg bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
                className="input input-bordered w-full pl-11 pr-10 py-3 rounded-lg bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
            disabled={isLoggingIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-full font-semibold tracking-wide py-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 text-white shadow-md hover:shadow-lg transition relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-5 blur-sm animate-pulse z-0" />
          </Motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleAuthButton />
        </div>
        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 space-y-2">
          <Link
            to="/forgot-password"
            className="text-purple-500 hover:underline"
          >
            Forgot Password?
          </Link>
          <div>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">
              Create new account!
            </Link>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default LoginPage;

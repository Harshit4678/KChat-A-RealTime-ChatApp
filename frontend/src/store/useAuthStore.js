import { create } from "zustand";
import { axiosIntance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://kchat-a-realtime-chatapp.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  banInfo: null,

  setAuthUser: (user) => set({ authUser: user }),

  checkAuth: async () => {
    try {
      const res = await axiosIntance.get("/auth/check");
      set({ authUser: res.data, banInfo: null });
      get().connectSocket();
    } catch (error) {
      const res = error.response;
      if (res && res.status === 403 && res.data?.message) {
        set({
          banInfo: {
            message: res.data.message,
            adminEmail: res.data.adminEmail || "admin@xxxx.com",
          },
          authUser: null,
        });
      } else {
        if (get().authUser) {
          toast.error("Session expired. Please log in again.");
        }
        set({ authUser: null, banInfo: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosIntance.post("/auth/signup", data);
      toast.success(res.data.message || "Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosIntance.post("/auth/login", data);
      set({ authUser: res.data, banInfo: null });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const res = error.response;
      if (res && res.status === 403 && res.data?.message) {
        set({
          banInfo: {
            message: res.data.message,
            adminEmail: res.data.adminEmail || "admin@xxxx.com",
          },
        });
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  googleLogin: async (token) => {
    set({ isLoggingIn: true });
    try {
      // yahan token google se aaega (frontend button -> backend API)
      const res = await axiosIntance.post("/auth/google", { token });
      set({ authUser: res.data, banInfo: null });
      toast.success("Logged in with Google successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosIntance.post("/auth/logout");
      set({ authUser: null, banInfo: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosIntance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

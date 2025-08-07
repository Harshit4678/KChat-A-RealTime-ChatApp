import axios from "axios";

export const axiosIntance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://kchat-a-realtime-chatapp.onrender.com",
  withCredentials: true,
});

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Send token if required in other APIs
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

export const loginAdmin = async (email, password) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};

export const getAllReports = async () => {
  const res = await API.get("/reports");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

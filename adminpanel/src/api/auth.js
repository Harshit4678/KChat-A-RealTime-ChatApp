import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/admin",
});

// Send token if required in other APIs
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

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

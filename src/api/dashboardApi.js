import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Dashboard stats error:", error);
    throw error;
  }
};
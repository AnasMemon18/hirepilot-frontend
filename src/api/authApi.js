import axios from "axios";

const API_BASE_URL = "https://hirepilot-backend-f381.onrender.com" || "http://localhost:5000";
 
// ✅ Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token to every request if it exists
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

// ✅ Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// ✅ Login user
export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// ✅ Logout user
export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// ✅ Get current user
export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("GetMe error:", error);
    throw error;
  }
};

// ✅ NEW: Forgot Password - Send reset code
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

// ✅ NEW: Reset Password - Verify code and set new password
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post("/api/auth/reset-password", {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};
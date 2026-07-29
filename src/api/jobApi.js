import axios from "axios";

 
const API_BASE_URL =  "http://localhost:5000"; 

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token interceptor
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

export const createJob = async (jobData) => {
  try {
    const response = await api.post("/createJob", jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await api.get("/getAllJobs");
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await api.get(`/getJobById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/updateJob/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/deleteJob/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

export const parseJobDescription = async (jobDescription) => {
  try {
    const response = await api.post("/parseJobDescription", { jobDescription });
    return response.data;
  } catch (error) {
    console.error("Error parsing job description:", error);
    throw error;
  }
};
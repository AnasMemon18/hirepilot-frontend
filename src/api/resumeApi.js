import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; 

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

export const uploadResumes = async (formData) => {
  try {
    const response = await api.post("/uploadResumes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading resumes:", error);
    throw error;
  }
};

export const getCandidatesByJob = async (jobId) => {
  try {
    const response = await api.get(`/candidates/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await api.get(`/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId) => {
  try {
    const response = await api.delete(`/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};

export const matchCandidate = async (candidateId) => {
  try {
    const response = await api.post(`/match/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error matching candidate:", error);
    throw error;
  }
};

export const matchAllCandidates = async (jobId) => {
  try {
    const response = await api.post(`/matchAll/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error matching all candidates:", error);
    throw error;
  }
};

// ✅ OPTIMIZED: Get all candidates across all jobs in ONE query

export const getAllCandidatesOptimized = async () => {
  try {
    const response = await api.get("/candidates/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all candidates:", error);
    throw error;
  }
};


 //✅ OPTIMIZED: Get top performers (60%+ score)
 
export const getTopPerformersOptimized = async (minScore = 60) => {
  try {
    const response = await api.get(`/candidates/top-performers?minScore=${minScore}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top performers:", error);
    throw error;
  }
};
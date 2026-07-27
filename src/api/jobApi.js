import axios from "axios";

const API_BASE_URL = "https://hirepilot-backend-f381.onrender.com";

export const createJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createJob`, jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllJobs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getJobById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};


export const updateJob = async (id, jobData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateJob/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteJob/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

export const parseJobDescription = async (jobDescription) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/parseJobDescription`, {
      jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error("Error parsing job description:", error);
    throw error;
  }
};
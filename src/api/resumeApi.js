import axios from "axios";

const API_BASE_URL = "https://hirepilot-backend-f381.onrender.com";

export const uploadResumes = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uploadResumes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const response = await axios.get(`${API_BASE_URL}/candidates/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};


export const matchCandidate = async (candidateId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/match/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error matching candidate:", error);
    throw error;
  }
};


export const matchAllCandidates = async (jobId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/matchAll/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error matching all candidates:", error);
    throw error;
  }
};
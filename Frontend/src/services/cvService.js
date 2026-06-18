import { API_ENDPOINTS } from '../config/api';

// Get token from localStorage
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const cvService = {
  // Upload CV files
  uploadCVs: async (formData) => {
    const response = await fetch(`${API_ENDPOINTS.UPLOAD_CV}`, {
      method: 'POST',
      headers: {
        ...(localStorage.getItem('token') && { 'Authorization': `Bearer ${localStorage.getItem('token')}` }),
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },

  // Screen CVs against job description
  screenCVs: async (jobData) => {
    const response = await fetch(`${API_ENDPOINTS.UPLOAD_CV}/screen`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },

  // Get screening results
  getResults: async (screeningId) => {
    const response = await fetch(`${API_ENDPOINTS.GET_RESULTS}/${screeningId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },

  // Get all rankings
  getRankings: async (screeningId) => {
    const response = await fetch(`${API_ENDPOINTS.GET_RANKINGS}/${screeningId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },

  // Get user's screening history
  getHistory: async () => {
    const response = await fetch(`${API_ENDPOINTS.UPLOAD_CV}/history`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },

  // Delete candidate from ranking
  deleteCandidate: async (filename, category) => {
    const response = await fetch(`${API_ENDPOINTS.GET_RANKINGS}/candidate`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ filename, category }),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  },
};

export default cvService;

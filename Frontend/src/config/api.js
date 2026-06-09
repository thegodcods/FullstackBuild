// API Configuration
// Centralized backend API URLs

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGOUT: `${API_BASE_URL}/api/logout`,

  // CV Screening
  UPLOAD_CV: `${API_BASE_URL}/api/upload-cv`,
  GET_RESULTS: `${API_BASE_URL}/api/results`,
  GET_RANKINGS: `${API_BASE_URL}/api/rankings`,

  // User
  GET_PROFILE: `${API_BASE_URL}/api/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/profile/update`,
};

export default API_BASE_URL;

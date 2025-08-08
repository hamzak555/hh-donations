// API Configuration for different environments
const getApiBaseUrl = () => {
  // In production, use relative URLs (same domain)
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // In development, use environment variable or fallback to localhost
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';
};

export const API_BASE = getApiBaseUrl();

export default {
  API_BASE
};
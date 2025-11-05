import axios from 'axios';

// API configuration
// Priority:
// 1) NEXT_PUBLIC_API_BASE_URL (explicit full API base, e.g. https://.../api)
// 2) NEXT_PUBLIC_API_URL (root URL, e.g. https://...)
// 3) fallback to Next.js proxy `/api` for local development
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to handle standard API response format
api.interceptors.response.use(
  (response) => {
    // Only extract data if it's a standard API response format
    if (response.data && response.data.status === 'success' && response.data.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error('API Error occurred:', error);

    // Handle different types of errors
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);

      // For validation errors (400), return the error data
      if (error.response.status === 400 && error.response.data) {
        return Promise.reject(error.response.data);
      }

      // For other HTTP errors, return a formatted error
      return Promise.reject({
        status: 'error',
        message: error.response.data?.message || `HTTP ${error.response.status} error`,
        statusCode: error.response.status
      });
    } else if (error.request) {
      console.error('Network error - no response received');
      return Promise.reject({
        status: 'error',
        message: 'Network error - unable to connect to server'
      });
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: 'error',
        message: error.message || 'Unknown error occurred'
      });
    }
  }
);

export default api;

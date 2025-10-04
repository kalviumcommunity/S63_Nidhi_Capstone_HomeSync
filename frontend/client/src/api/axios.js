import axios from 'axios';

// Create axios instance with optimizations
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
  // Enable response caching
  cache: {
    maxAge: 5 * 60 * 1000, // 5 minutes cache
    exclude: { predicate: request => request.method !== 'GET' }
  }
});

// Request Interceptor: Add token to header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

// Create axios instance with base URL for Django backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api/',  // Support both dev and production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials to avoid CORS issues
});

// Add request interceptor to include auth token and CSRF token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', config.method?.toUpperCase(), config.url);
    console.log('📡 Request data:', config.data);
    console.log('🌐 Full URL:', config.baseURL + config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for Django
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken.split('=')[1];
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', response.status, response.config.url);
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API error:', error.response?.status, error.config?.url);
    console.error('🔍 Error details:', error.response?.data);
    console.error('🌐 Full URL that failed:', error.config?.baseURL + error.config?.url);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
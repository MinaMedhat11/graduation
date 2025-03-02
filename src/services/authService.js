import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add interceptor to handle token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.status && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return {
        success: response.data.status,
        message: response.data.message,
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('register', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        gender: userData.gender,
        region_id: userData.region_id,
        age: userData.age
      });
      
      return {
        success: response.data.status,
        message: response.data.message,
        user: response.data.data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      if (response.data.status) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return {
        success: response.data.status,
        message: response.data.message
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove items even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      };
    }
  },

  // Check auth status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/user');
      return {
        success: response.data.status,
        user: response.data.data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Authentication check failed'
      };
    }
  }
}; 
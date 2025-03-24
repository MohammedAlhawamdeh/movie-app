import axios from 'axios';
import env from '../utils/environment';

const API_URL = `${env.apiUrl}/api/users`;

// Create an axios instance
const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('Auth API Error:', {
      status: error.response?.status,
      message,
      url: error.config?.url
    });
    return Promise.reject(message);
  }
);

// Configure request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add token to requests if it exists
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    const response = await api.post(`/api/users/register`, userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  try {
    console.log('Logging in with data:', {...userData, password: '******'});
    const response = await api.post(`/api/users/login`, userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Verify admin access
const verifyAdmin = async () => {
  try {
    const response = await api.get('/api/admin/test');
    return response.status === 200;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

// Get user profile
const getProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  verifyAdmin,
  getProfile
};

export default authService;

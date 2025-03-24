import axios from 'axios';
import env from '../utils/environment';

const API_URL = `${env.apiUrl}/api/reviews`;

// Create an axios instance
const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', {
      status: error.response?.status,
      message,
      url: error.config?.url
    });
    return Promise.reject(message);
  }
);

// Get user's reviews
const getMyReviews = async () => {
  const response = await api.get(`${API_URL}/my-reviews`);
  return response.data;
};

// Get movie reviews
const getMovieReviews = async (movieId) => {
  const response = await api.get(`${API_URL}/movie/${movieId}`);
  return response.data;
};

// Create new review
const createReview = async (movieId, reviewData) => {
  const response = await api.post(`${API_URL}/${movieId}`, reviewData);
  return response.data;
};

// Update review
const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`${API_URL}/${reviewId}`, reviewData);
  return response.data;
};

// Delete review
const deleteReview = async (reviewId) => {
  const response = await api.delete(`${API_URL}/${reviewId}`);
  return response.data;
};

const reviewService = {
  getMyReviews,
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
};

export default reviewService;
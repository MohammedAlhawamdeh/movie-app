import axios from 'axios';
import env from '../utils/environment';

const API_URL = `${env.apiUrl}/api/movies`;

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

// Get trending movies
const getTrendingMovies = async () => {
  const response = await api.get(`${API_URL}/trending`);
  return response.data;
};

// Get movie list with optional search and category filters
const getMovies = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.query) params.append('query', options.query);
  if (options.category) params.append('category', options.category);
  if (options.sort_by) params.append('sort_by', options.sort_by);
  if (options.year) params.append('year', options.year);
  if (options.page) params.append('page', options.page);

  const response = await api.get(API_URL, { params });
  return response.data;
};

// Get movie details by ID
const getMovieDetails = async (id) => {
  if (!id) throw new Error('Movie ID is required');
  
  try {
    console.log(`Fetching movie details for ID: ${id}`);
    const response = await api.get(`${API_URL}/${id}`);
    console.log(`Successfully retrieved movie details for ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    // Add more context to the error
    if (error.response?.status === 404) {
      throw new Error(`Movie with ID ${id} not found`);
    }
    throw error;
  }
};

// Get favorite movies
const getFavorites = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await api.get(`${API_URL}/favorites`, config);
  return response.data;
};

// Add movie to favorites
const addToFavorites = async (movieData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await api.post(`${API_URL}/favorites`, movieData, config);
  return response.data;
};

// Remove movie from favorites
const removeFromFavorites = async (movieId, token) => {
  if (!movieId) {
    throw new Error('Cannot remove: Movie ID is required');
  }
  
  // Ensure movieId is a number
  const numericId = Number(movieId);
  if (isNaN(numericId)) {
    throw new Error('Invalid movie ID format');
  }
  
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  console.log(`Sending DELETE request to ${API_URL}/favorites/${numericId}`);
  const response = await api.delete(`${API_URL}/favorites/${numericId}`, config);
  return response.data;
};

// Get watchlist movies
const getWatchlist = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await api.get(`${API_URL}/watchlist`, config);
  return response.data;
};

// Add movie to watchlist
const addToWatchlist = async (movieData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await api.post(`${API_URL}/watchlist`, movieData, config);
  return response.data;
};

// Remove movie from watchlist
const removeFromWatchlist = async (movieId, token) => {
  if (!movieId) {
    throw new Error('Cannot remove: Movie ID is required');
  }
  
  // Ensure movieId is a number
  const numericId = Number(movieId);
  if (isNaN(numericId)) {
    throw new Error('Invalid movie ID format');
  }
  
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  console.log(`Sending DELETE request to ${API_URL}/watchlist/${numericId}`);
  const response = await api.delete(`${API_URL}/watchlist/${numericId}`, config);
  return response.data;
};

const movieService = {
  getTrendingMovies,
  getMovies,
  getMovieDetails,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};

export default movieService;
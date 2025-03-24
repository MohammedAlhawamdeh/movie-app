const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const validateApiKey = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not defined in environment variables');
  }
  return apiKey;
};

const testConnection = async () => {
  try {
    const apiKey = validateApiKey();
    console.log('Testing TMDB API connection...');
    
    const url = `${TMDB_BASE_URL}/configuration`;
    const response = await axios.get(url, {
      params: { api_key: apiKey },
      headers: { 'Accept': 'application/json' }
    });

    if (response.data && response.data.images) {
      console.log('TMDB API Connection: Success');
      console.log('Base URL:', response.data.images.secure_base_url);
      return true;
    }

    throw new Error('Invalid TMDB API response format');
  } catch (error) {
    console.error('TMDB API Connection Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return false;
  }
};

const makeRequest = async (endpoint, params = {}) => {
  const apiKey = validateApiKey();
  const url = `${TMDB_BASE_URL}${endpoint}`;
  
  console.log(`Making TMDB request to: ${endpoint}`);
  
  try {
    const response = await axios.get(url, {
      params: {
        ...params,
        api_key: apiKey
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log(`TMDB request successful: ${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`TMDB API Request Failed (${endpoint}):`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params
      }
    });
    throw error;
  }
};

module.exports = {
  testConnection,
  makeRequest
};
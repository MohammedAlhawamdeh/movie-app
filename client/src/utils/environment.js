// Environment configuration utility
const env = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY,
  tmdbImageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/',

  // Feature Flags
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  enableAuth: import.meta.env.VITE_ENABLE_AUTH !== 'false',

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Movie Explorer',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Discover and track your favorite movies',

  // Environment
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',

  // Image URLs
  getImageUrl: (path, size = 'w500') => {
    if (!path) return null;
    return `${env.tmdbImageBaseUrl}${size}${path}`;
  },

  // API URLs
  getApiUrl: (path) => {
    return `${env.apiUrl}${path}`;
  }
};

// Export individual properties as named exports
export const { 
  isDevelopment, 
  isProduction,
  appName,
  appDescription,
  apiUrl 
} = env;

export default env;
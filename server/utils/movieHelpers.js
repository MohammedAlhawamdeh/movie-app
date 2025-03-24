/**
 * Helper functions for handling movie data
 */

// Normalize movie data from TMDB API
const normalizeMovieData = (tmdbMovie) => {
  if (!tmdbMovie) return null;

  return {
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview || '',
    poster_path: tmdbMovie.poster_path,
    backdrop_path: tmdbMovie.backdrop_path,
    release_date: tmdbMovie.release_date,
    vote_average: tmdbMovie.vote_average,
    vote_count: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity,
    genres: tmdbMovie.genres || [],
    runtime: tmdbMovie.runtime,
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline,
    budget: tmdbMovie.budget,
    revenue: tmdbMovie.revenue,
    production_companies: tmdbMovie.production_companies || [],
    videos: tmdbMovie.videos,
    credits: tmdbMovie.credits
  };
};

// Format movie data for user response (favorites/watchlist)
const formatMovieForUser = (movie) => {
  return {
    movieId: movie.tmdbId || movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  };
};

// Validate movie data
const validateMovieData = (movie) => {
  const requiredFields = ['id', 'title'];
  const missingFields = requiredFields.filter(field => !movie[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
};

// Format error response
const formatMovieError = (error, operation) => {
  return {
    message: error.message || `Failed to ${operation} movie`,
    code: error.response?.data?.status_code,
    success: false,
    operation,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  normalizeMovieData,
  formatMovieForUser,
  validateMovieData,
  formatMovieError
};
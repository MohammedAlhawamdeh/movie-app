const asyncHandler = require('express-async-handler');
const { makeRequest } = require('../utils/tmdb');
const Movie = require('../models/movieModel');
const User = require('../models/userModel');

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = asyncHandler(async (req, res) => {
  console.log('Fetching trending movies...');
  
  try {
    // First check database for cached trending movies
    const cachedMovies = await Movie.find()
      .sort({ popularity: -1 })
      .limit(20);

    // If we have recent cached movies and they're not stale, return them
    if (cachedMovies.length > 0 && !cachedMovies[0].needsUpdate()) {
      console.log('Returning cached trending movies');
      return res.json(cachedMovies);
    }

    // Fetch from TMDB API
    console.log('Making TMDB API request for trending movies...');
    const data = await makeRequest('/trending/movie/day', { language: 'en-US' });
    console.log(`Received ${data.results?.length} movies from TMDB`);

    // Cache the results in database
    await Promise.all(data.results.map(async (movieData) => {
      await Movie.findOneAndUpdate(
        { tmdbId: movieData.id },
        {
          tmdbId: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          popularity: movieData.popularity,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }));

    res.json(data.results);
  } catch (error) {
    console.error('Error in getTrendingMovies:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500);
    throw new Error('Error fetching trending movies');
  }
});

// @desc    Get movies with optional search
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  try {
    const { query, category, page = 1, sort_by = 'popularity.desc', year } = req.query;
    let endpoint = '/discover/movie';
    let params = {
      language: 'en-US',
      include_adult: false,
      page: page,
      sort_by: sort_by
    };

    // Add year filter if provided
    if (year) {
      params.primary_release_year = year;
    }

    // First check cache if no specific search parameters and no sorting/filtering
    if (!query && (!category || category === 'all') && sort_by === 'popularity.desc' && !year) {
      const cachedMovies = await Movie.find()
        .sort({ popularity: -1 })
        .limit(20)
        .skip((page - 1) * 20);
      
      // If we have recent cached movies and they're not stale, return them
      if (cachedMovies.length > 0 && !cachedMovies[0].needsUpdate()) {
        console.log('Returning cached movies');
        return res.json({
          results: cachedMovies,
          page: parseInt(page),
          total_pages: Math.ceil(await Movie.countDocuments() / 20)
        });
      }
    }

    // If search is provided, use search endpoint
    if (query) {
      endpoint = '/search/movie';
      params.query = query;
      console.log(`Searching for movies with query: ${query}`);
    }

    // If category is provided, add genre filter
    if (category && category !== 'all') {
      params.with_genres = category;
      console.log(`Filtering by genre ID: ${category}`);
    }

    // Make request to TMDB API
    console.log(`Making request to TMDB API endpoint: ${endpoint} with params:`, params);
    const data = await makeRequest(endpoint, params);
    
    // Cache results if this was a default request without special filters
    if (!query && (!category || category === 'all') && sort_by === 'popularity.desc' && !year) {
      console.log('Caching results in database');
      await Promise.all(data.results.map(async (movieData) => {
        await Movie.findOneAndUpdate(
          { tmdbId: movieData.id },
          {
            tmdbId: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            poster_path: movieData.poster_path,
            backdrop_path: movieData.backdrop_path,
            release_date: movieData.release_date,
            vote_average: movieData.vote_average,
            vote_count: movieData.vote_count,
            popularity: movieData.popularity,
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );
      }));
    }

    res.json(data);
  } catch (error) {
    console.error('Error in getMovies:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500);
    throw new Error('Error fetching movies');
  }
});

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  // Get from middleware or check again to be sure
  const isNumeric = req.isNumericId || !isNaN(parseInt(movieId, 10));
  
  console.log(`Fetching details for movie ID: ${movieId} (${isNumeric ? 'numeric' : 'string'})`);

  try {
    let movie = null;
    
    // Try to find in our database first
    if (isNumeric) {
      // If ID is numeric, search by TMDB ID
      const numericId = parseInt(movieId, 10);
      movie = await Movie.findOne({ tmdbId: numericId });
      
      // If found in database and not stale
      if (movie && !movie.needsUpdate() && movie.videos) {
        console.log(`Returning cached movie details for TMDB ID: ${numericId}`);
        return res.json(movie);
      }
      
      // If not found in DB or stale, fetch from TMDB
      console.log(`Fetching from TMDB API for ID: ${numericId}`);
      try {
        const data = await makeRequest(`/movie/${numericId}`, {
          language: 'en-US',
          append_to_response: 'videos,credits'
        });

        // Ensure videos array exists even if empty
        if (!data.videos) {
          data.videos = { results: [] };
        }

        // Update or create in database
        const updatedMovie = await Movie.findOneAndUpdate(
          { tmdbId: data.id },
          {
            tmdbId: data.id,
            title: data.title,
            overview: data.overview,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            release_date: data.release_date,
            vote_average: data.vote_average,
            vote_count: data.vote_count,
            popularity: data.popularity,
            genres: data.genres,
            videos: data.videos,
            credits: data.credits,
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );

        console.log(`Successfully fetched and cached movie details for ID: ${numericId}`);
        return res.json(data);
      } catch (tmdbError) {
        console.error('TMDB API Error:', tmdbError);
        
        // Check if it's a 404 from TMDB
        if (tmdbError.response && tmdbError.response.status === 404) {
          res.status(404);
          throw new Error('Movie not found in TMDB database');
        }
        
        // If we have an existing movie in DB but TMDB fetch failed, return what we have
        if (movie) {
          console.log(`Returning existing database movie for ID: ${numericId}`);
          return res.json(movie);
        }
        
        // Otherwise pass the error through
        throw tmdbError;
      }
    } else {
      // If ID is a string (possibly MongoDB _id)
      try {
        movie = await Movie.findById(movieId);
        if (movie) {
          console.log(`Found movie by MongoDB ID: ${movieId}`);
          return res.json(movie);
        } else {
          res.status(404);
          throw new Error(`Movie not found with ID: ${movieId}`);
        }
      } catch (err) {
        console.error(`Error finding movie by ID ${movieId}:`, err);
        res.status(404);
        throw new Error('Movie not found - invalid ID format');
      }
    }
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    
    // Determine appropriate status code
    const statusCode = error.response?.status || 
                       (error.message.includes('not found') ? 404 : 500);
    
    res.status(statusCode);
    throw new Error(error.message || 'Error fetching movie details');
  }
});

// ----- FAVORITES FUNCTIONS -----

// @desc    Get user favorites
// @route   GET /api/movies/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    console.log(`Returning ${user.favorites.length} favorites for user ${user.name}`);
    res.json(user.favorites || []);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500);
    throw new Error('Failed to get favorites');
  }
});

// @desc    Add movie to favorites
// @route   POST /api/movies/favorites
// @access  Private
const addToFavorites = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Format the movie data according to our schema
    const movieData = {
      tmdbId: Number(req.body.id || req.body.tmdbId),
      title: req.body.title,
      poster_path: req.body.poster_path,
      vote_average: req.body.vote_average,
      release_date: req.body.release_date
    };
    
    // Validate required fields
    if (!movieData.tmdbId || !movieData.title) {
      res.status(400);
      throw new Error('Movie ID and title are required');
    }
    
    console.log(`Adding movie to favorites: ${movieData.title} (ID: ${movieData.tmdbId})`);
    
    // Check if movie already exists in favorites
    const movieExists = user.favorites.some(movie => movie.tmdbId === movieData.tmdbId);
    if (movieExists) {
      res.status(400);
      throw new Error('Movie already in favorites');
    }
    
    // Add to favorites
    user.favorites.push(movieData);
    await user.save();
    
    res.status(201).json(movieData);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to add to favorites');
  }
});

// @desc    Remove movie from favorites
// @route   DELETE /api/movies/favorites/:id
// @access  Private
const removeFromFavorites = asyncHandler(async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      res.status(400);
      throw new Error('Invalid movie ID format');
    }
    
    console.log(`Removing movie ID ${movieId} from favorites`);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Find movie in favorites
    const initialCount = user.favorites.length;
    const updatedFavorites = user.favorites.filter(movie => movie.tmdbId !== movieId);
    
    // Check if movie was found
    if (updatedFavorites.length === initialCount) {
      res.status(404);
      throw new Error('Movie not found in favorites');
    }
    
    // Update user document
    user.favorites = updatedFavorites;
    await user.save();
    
    res.json({ 
      tmdbId: movieId,
      message: 'Movie removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to remove from favorites');
  }
});

// ----- WATCHLIST FUNCTIONS -----

// @desc    Get user watchlist
// @route   GET /api/movies/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    console.log(`Returning ${user.watchlist.length} watchlist items for user ${user.name}`);
    res.json(user.watchlist || []);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    res.status(500);
    throw new Error('Failed to get watchlist');
  }
});

// @desc    Add movie to watchlist
// @route   POST /api/movies/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Format the movie data according to our schema
    const movieData = {
      tmdbId: Number(req.body.id || req.body.tmdbId),
      title: req.body.title,
      poster_path: req.body.poster_path,
      vote_average: req.body.vote_average,
      release_date: req.body.release_date
    };
    
    // Validate required fields
    if (!movieData.tmdbId || !movieData.title) {
      res.status(400);
      throw new Error('Movie ID and title are required');
    }
    
    console.log(`Adding movie to watchlist: ${movieData.title} (ID: ${movieData.tmdbId})`);
    
    // Check if movie already exists in watchlist
    const movieExists = user.watchlist.some(movie => movie.tmdbId === movieData.tmdbId);
    if (movieExists) {
      res.status(400);
      throw new Error('Movie already in watchlist');
    }
    
    // Add to watchlist
    user.watchlist.push(movieData);
    await user.save();
    
    res.status(201).json(movieData);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to add to watchlist');
  }
});

// @desc    Remove movie from watchlist
// @route   DELETE /api/movies/watchlist/:id
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      res.status(400);
      throw new Error('Invalid movie ID format');
    }
    
    console.log(`Removing movie ID ${movieId} from watchlist`);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Find movie in watchlist
    const initialCount = user.watchlist.length;
    const updatedWatchlist = user.watchlist.filter(movie => movie.tmdbId !== movieId);
    
    // Check if movie was found
    if (updatedWatchlist.length === initialCount) {
      res.status(404);
      throw new Error('Movie not found in watchlist');
    }
    
    // Update user document
    user.watchlist = updatedWatchlist;
    await user.save();
    
    res.json({ 
      tmdbId: movieId,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to remove from watchlist');
  }
});

module.exports = {
  getTrendingMovies,
  getMovies,
  getMovieDetails,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
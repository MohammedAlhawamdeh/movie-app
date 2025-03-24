const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTrendingMovies,
  getMovies,
  getMovieDetails,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/movieController');

// Validate and prepare movie ID middleware
const prepareMovieId = (req, res, next) => {
  const id = req.params.id;
  
  // First try to parse as a number (TMDB IDs are numeric)
  const numericId = parseInt(id, 10);
  
  if (!isNaN(numericId)) {
    // If valid number, use the numeric representation
    req.params.id = numericId;
    req.isNumericId = true;
  } else {
    // Keep the original string ID (could be a MongoDB ID)
    req.isNumericId = false;
  }
  
  next();
};

// Test route to verify API status
router.get('/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Movie API is working',
    timestamp: new Date().toISOString()
  });
});

// Public routes
router.get('/trending', getTrendingMovies);
router.get('/', getMovies);
router.get('/:id', prepareMovieId, getMovieDetails);

// Protected routes - Favorites
router.route('/favorites')
  .get(protect, getFavorites)
  .post(protect, addToFavorites);
router.delete('/favorites/:id', protect, removeFromFavorites);

// Protected routes - Watchlist
router.route('/watchlist')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);
router.delete('/watchlist/:id', protect, removeFromWatchlist);

module.exports = router;

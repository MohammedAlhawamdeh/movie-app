const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name');

  res.status(200).json(reviews);
});

// @desc    Get movie reviews
// @route   GET /api/reviews/movie/:movieId
// @access  Public
const getMovieReviews = asyncHandler(async (req, res) => {
  // First, find the movie by tmdbId
  const Movie = require('../models/movieModel');
  const movie = await Movie.findOne({ tmdbId: parseInt(req.params.movieId) });
  
  if (!movie) {
    return res.status(200).json([]); // Return empty array if movie not found
  }
  
  // Then find reviews for that movie
  const reviews = await Review.find({ movie: movie._id })
    .sort({ createdAt: -1 })
    .populate('user', 'name');

  res.status(200).json(reviews);
});

// @desc    Create new review
// @route   POST /api/reviews/:movieId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, content, title } = req.body;
  const movieTmdbId = parseInt(req.params.movieId);
  
  if (!rating || !content || !title) {
    res.status(400);
    throw new Error('Please provide rating, title, and content');
  }

  // Find movie in database by TMDB ID
  const Movie = require('../models/movieModel');
  let movie = await Movie.findOne({ tmdbId: movieTmdbId });
  
  // If movie doesn't exist in our DB yet, create a minimal record
  if (!movie) {
    const { makeRequest } = require('../utils/tmdb');
    
    try {
      // Get movie details from TMDB
      const movieData = await makeRequest(`/movie/${movieTmdbId}`);
      
      // Create a minimal movie record
      movie = await Movie.create({
        tmdbId: movieData.id,
        title: movieData.title,
        poster_path: movieData.poster_path,
        backdrop_path: movieData.backdrop_path,
        release_date: movieData.release_date,
        vote_average: movieData.vote_average,
        vote_count: movieData.vote_count,
        popularity: movieData.popularity,
        lastUpdated: new Date()
      });
      
      console.log(`Created movie record for ${movie.title}`);
    } catch (error) {
      console.error('Error creating movie record:', error);
      res.status(404);
      throw new Error('Movie not found');
    }
  }

  // Check if user already reviewed this movie
  const existingReview = await Review.findOne({
    user: req.user.id,
    movie: movie._id
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this movie');
  }

  // Create review
  const review = await Review.create({
    user: req.user.id,
    movie: movie._id,
    rating,
    title,
    content
  });

  // Populate review with user info
  const populatedReview = await Review.findById(review._id)
    .populate('user', 'name')
    .populate('movie', 'title poster_path');
  
  res.status(201).json(populatedReview);
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('user', 'name');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.status(200).json(review);
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  const { rating, content } = req.body;

  review.rating = rating || review.rating;
  review.content = content || review.content;
  review.updatedAt = Date.now();

  const updatedReview = await review.save();
  await updatedReview.populate('user', 'name');

  res.status(200).json(updatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getMyReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getMovieReviews,
};
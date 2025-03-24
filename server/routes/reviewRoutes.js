const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getMyReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getMovieReviews 
} = require('../controllers/reviewController');
const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');

// Get routes
router.get('/movie/:movieId', getMovieReviews);
router.get('/my-reviews', protect, getMyReviews);
router.get('/:id', getReview);

// Post routes
router.post('/:movieId', protect, createReview);

// Update route
router.put('/:id', protect, updateReview);

// Delete route
router.delete('/:id', protect, deleteReview);

// Report review
router.post('/:id/report', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user already reported
  const alreadyReported = review.reportedBy.some(
    report => report.user.toString() === req.user.id
  );

  if (alreadyReported) {
    res.status(400);
    throw new Error('You have already reported this review');
  }

  review.reported = true;
  review.reportCount += 1;
  review.reportedBy.push({
    user: req.user.id,
    reason: req.body.reason
  });

  await review.save();
  res.json({ message: 'Review reported' });
}));

// Like review
router.post('/:id/like', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if already liked
  const alreadyLiked = review.likes.includes(req.user.id);

  if (alreadyLiked) {
    // Unlike
    review.likes = review.likes.filter(
      userId => userId.toString() !== req.user.id
    );
  } else {
    // Like
    review.likes.push(req.user.id);
  }

  await review.save();
  res.json({ likes: review.likes.length, liked: !alreadyLiked });
}));

module.exports = router;
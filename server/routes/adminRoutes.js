const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const asyncHandler = require('express-async-handler');

// Test route
router.get('/test', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin routes working' });
});

// User management routes
router.get('/users', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

// Ban/unban user
router.put('/users/:id/ban', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'}` });
}));

// Review management routes
router.get('/reviews', protect, adminOnly, asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name')
    .populate('movie', 'title');
  res.json(reviews);
}));

router.get('/reviews/reported', protect, adminOnly, asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reported: true })
    .populate('user', 'name')
    .populate('movie', 'title');
  res.json(reviews);
}));

router.delete('/reviews/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.remove();
  res.json({ message: 'Review removed' });
}));

// Statistics routes
router.get('/stats', protect, adminOnly, asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const reviewCount = await Review.countDocuments();
  const reportedReviews = await Review.countDocuments({ reported: true });

  res.json({
    users: userCount,
    reviews: reviewCount,
    reportedReviews
  });
}));

module.exports = router;
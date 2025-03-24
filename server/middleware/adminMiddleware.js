const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const adminOnly = asyncHandler(async (req, res, next) => {
  // Check if user exists and is admin
  if (!req.user || !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized, admin access required');
  }

  next();
});

module.exports = { adminOnly };
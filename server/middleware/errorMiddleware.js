const errorHandler = (err, req, res, next) => {
  // Log the error details
  console.error('Error Handler:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    response: err.response?.data // For axios errors from TMDB
  });

  // Get status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send response
  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.response?.data && { tmdbError: err.response.data }) // Include TMDB error details in development
  });
};

module.exports = { errorHandler };

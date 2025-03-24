const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { testConnection: testTMDB } = require('./utils/tmdb');

// Load env vars from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify environment variables
const verifyEnv = () => {
  const required = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'TMDB_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  console.log('Environment Check:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? 'Set' : 'Not set',
    MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    TMDB_API_KEY: process.env.TMDB_API_KEY ? 'Set' : 'Not set'
  });
};

// Initialize Express
const app = express();

// CORS configuration
// Get allowed origins from environment or use default development origins
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['https://movies-app-iiiup.ondigitalocean.app'];
  }
  return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Startup sequence
const startServer = async () => {
  try {
    // Verify environment
    verifyEnv();

    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB Connected');

    // Test TMDB API
    const tmdbConnected = await testTMDB();
    if (!tmdbConnected) {
      console.error('Warning: TMDB API connection test failed');
    }

    // Middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // API Status route
    app.get('/api/status', (req, res) => {
      res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    // Routes
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/movies', require('./routes/movieRoutes'));
    app.use('/api/reviews', require('./routes/reviewRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      // Set static folder
      const clientPath = process.env.CLIENT_PATH || path.join(__dirname, '../client/dist');
      app.use(express.static(clientPath));

      // Handle client routing - serve index.html for any non-api routes
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientPath, 'index.html'));
      });
    }

    // Error handling for API routes
    app.use((req, res, next) => {
      res.status(404);
      throw new Error(`Not Found - ${req.originalUrl}`);
    });

    app.use(errorHandler);

    // Start server
    const PORT = process.env.NODE_ENV === 'production' ? 8080 : (process.env.PORT || 5000);
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

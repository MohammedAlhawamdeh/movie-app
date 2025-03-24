# Movie App

A full-stack movie application using TMDB API, React, and Node.js.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd movie-app

# Install all dependencies (client, server, and root)
npm run install-all

# Start both client and server
npm run dev
```

## Setup Instructions

### 1. Environment Variables

Create `.env` files for both client and server:

#### Client Environment (client/.env)
```bash
# Copy the example file
cp client/.env.example client/.env

# Edit client/.env and add your TMDB API key
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

#### Server Environment (server/.env)
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env and add your configuration
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 2. Start the Application

```bash
# Run both client and server in development mode
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

## Available Scripts

- `npm run dev` - Run both client and server concurrently
- `npm run server` - Run only the server with nodemon
- `npm run client` - Run only the client
- `npm run install-all` - Install dependencies for client, server, and root

## Features

- Movie browsing and search
- User authentication
- Favorites management
- Watchlist functionality
- Movie details and reviews
- Direct TMDB API integration
- Dark mode support
- Responsive design

## Project Structure

```
movie-app/
├── client/              # React frontend
│   ├── src/
│   ├── .env.example    # Client environment example
│   └── vite.config.js  # Vite configuration
├── server/             # Node.js backend
│   ├── controllers/    # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── .env.example   # Server environment example
│   └── server.js      # Server entry point
└── package.json       # Root package.json for running both services
```

## Technology Stack

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

### API
- TMDB API for movie data
- Local API for user features

## Environment Variables

### Client (.env)
```bash
VITE_TMDB_API_KEY=     # Your TMDB API key
```

### Server (.env)
```bash
PORT=5000              # Server port
MONGO_URI=            # MongoDB connection string
JWT_SECRET=           # JWT secret key
NODE_ENV=development  # Environment (development/production)
```

## Troubleshooting

### Installation Issues

If you encounter installation problems:

1. Clear npm cache and node_modules:
```bash
# Remove existing node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm run install-all
```

2. If nodemon is not found:
```bash
# Install nodemon globally (alternative solution)
npm install -g nodemon

# Or reinstall server dependencies
cd server && npm install
```

### Runtime Issues

1. Environment Variables
   - Ensure all .env files are properly configured
   - Check that TMDB API key is valid
   - Verify MongoDB connection string is correct

2. MongoDB Connection
   - Ensure MongoDB is running if using local database
   - Check MongoDB Atlas network access if using cloud

3. Port Conflicts
   - Server default port: 5000
   - Client default port: 5173
   - Change ports in .env files if needed

4. API Issues
   - Check browser console for TMDB API errors
   - Verify CORS settings if needed
   - Check server logs for detailed error messages

## Development Notes

- The client makes direct TMDB API calls for movie data
- The server handles user-specific features (auth, favorites, etc.)
- Concurrent running of both services is managed by the root package.json
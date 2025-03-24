const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  poster_path: String,
  backdrop_path: String,
  release_date: String,
  vote_average: Number,
  vote_count: Number,
  popularity: Number,
  genres: [{
    id: Number,
    name: String
  }],
  videos: {
    results: [{
      key: String,
      name: String,
      site: String,
      type: String
    }]
  },
  credits: {
    cast: [{
      id: Number,
      name: String,
      character: String,
      profile_path: String,
      order: Number
    }],
    crew: [{
      id: Number,
      name: String,
      job: String,
      department: String
    }]
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Cache timeout (24 hours)
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000;

// Check if movie data needs update
movieSchema.methods.needsUpdate = function() {
  if (!this.lastUpdated) return true;
  
  const now = new Date();
  const timeSinceUpdate = now - this.lastUpdated;
  return timeSinceUpdate > CACHE_TIMEOUT;
};

// Index for faster queries
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ 'genres.id': 1 });
movieSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Movie', movieSchema);
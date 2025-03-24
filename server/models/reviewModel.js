const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    reported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
reviewSchema.index({ movie: 1, user: 1 }, { unique: true }); // One review per movie per user
reviewSchema.index({ reported: 1 }); // For finding reported reviews
reviewSchema.index({ user: 1 }); // For finding user's reviews

// Update movie rating when review is added/modified/removed
reviewSchema.post('save', async function() {
  await updateMovieRating(this.movie);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await updateMovieRating(this.movie);
});

// Helper function to update movie rating
async function updateMovieRating(movieId) {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ movie: movieId });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    await mongoose.model('Movie').findByIdAndUpdate(movieId, {
      rating: avgRating.toFixed(1),
      numReviews: reviews.length
    });
  }
}

module.exports = mongoose.model('Review', reviewSchema);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

const initialState = {
  myReviews: [],
  movieReviews: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user's reviews
export const getMyReviews = createAsyncThunk(
  'reviews/getMyReviews',
  async (_, thunkAPI) => {
    try {
      return await reviewService.getMyReviews();
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get movie reviews
export const getMovieReviews = createAsyncThunk(
  'reviews/getMovieReviews',
  async (movieId, thunkAPI) => {
    try {
      return await reviewService.getMovieReviews(movieId);
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ movieId, reviewData }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        throw new Error('Authentication required');
      }
      return await reviewService.createReview(movieId, reviewData);
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        throw new Error('Authentication required');
      }
      return await reviewService.updateReview(reviewId, reviewData);
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        throw new Error('Authentication required');
      }
      const response = await reviewService.deleteReview(reviewId);
      return { reviewId, ...response };
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearMovieReviews: (state) => {
      state.movieReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my reviews
      .addCase(getMyReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myReviews = action.payload;
      })
      .addCase(getMyReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get movie reviews
      .addCase(getMovieReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovieReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movieReviews = action.payload;
      })
      .addCase(getMovieReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movieReviews.unshift(action.payload);
        state.myReviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myReviews = state.myReviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        );
        state.movieReviews = state.movieReviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        );
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myReviews = state.myReviews.filter(
          (review) => review._id !== action.payload.reviewId
        );
        state.movieReviews = state.movieReviews.filter(
          (review) => review._id !== action.payload.reviewId
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearMovieReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
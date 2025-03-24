import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieService from '../../services/movieService';

const initialState = {
  movies: [],
  trendingMovies: [],
  movie: null,
  watchlist: [],
  favorites: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get trending movies
export const getTrendingMovies = createAsyncThunk(
  'movies/trending',
  async (_, thunkAPI) => {
    try {
      return await movieService.getTrendingMovies();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('Trending movies error:', message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async (options, thunkAPI) => {
    try {
      return await movieService.getMovies(options);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get movie details
export const getMovieDetails = createAsyncThunk(
  'movies/getDetails',
  async (id, thunkAPI) => {
    try {
      console.log(`Redux: Fetching movie details for ID: ${id}`);
      
      // Validate ID
      if (!id) {
        return thunkAPI.rejectWithValue('Movie ID is required');
      }
      
      // Convert ID to string to ensure compatibility
      const movieId = String(id).trim();
      
      // Additional validation for empty ID
      if (!movieId || movieId === 'undefined' || movieId === 'null') {
        return thunkAPI.rejectWithValue('Invalid movie ID');
      }
      
      return await movieService.getMovieDetails(movieId);
    } catch (error) {
      console.error(`Redux Error fetching movie ${id}:`, error);
      // Improved error handling
      const message = error.message || 'Failed to fetch movie details';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ---- FAVORITES ACTIONS ----

// Get favorites
export const getFavorites = createAsyncThunk(
  'movies/getFavorites',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const favorites = await movieService.getFavorites(token);
      console.log('Got favorites:', favorites);
      return favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add to favorites
export const addToFavorites = createAsyncThunk(
  'movies/addToFavorites',
  async (movie, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }

      // Format the movie data for the API
      const movieData = {
        id: movie.id, // TMDB uses 'id' which will be converted to tmdbId on server
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      };

      console.log('Adding to favorites:', movieData);
      const result = await movieService.addToFavorites(movieData, token);
      return result;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      const errorMessage = error.message || 'Failed to add to favorites';
      
      // Check for duplicate error
      if (errorMessage.includes('already in favorites')) {
        return thunkAPI.rejectWithValue('Movie is already in your favorites');
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Remove from favorites
export const removeFromFavorites = createAsyncThunk(
  'movies/removeFromFavorites',
  async (movieId, thunkAPI) => {
    try {
      if (!movieId) {
        return thunkAPI.rejectWithValue('Movie ID is required');
      }
      
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      // Ensure movieId is a number
      const numericId = Number(movieId);
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid movie ID format');
      }
      
      console.log('Removing from favorites, ID:', numericId);
      await movieService.removeFromFavorites(numericId, token);
      return { removedId: numericId };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ---- WATCHLIST ACTIONS ----

// Get watchlist
export const getWatchlist = createAsyncThunk(
  'movies/getWatchlist',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const watchlist = await movieService.getWatchlist(token);
      console.log('Got watchlist:', watchlist);
      return watchlist;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add to watchlist
export const addToWatchlist = createAsyncThunk(
  'movies/addToWatchlist',
  async (movie, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }

      // Format the movie data for the API
      const movieData = {
        id: movie.id, // TMDB uses 'id' which will be converted to tmdbId on server
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      };

      console.log('Adding to watchlist:', movieData);
      const result = await movieService.addToWatchlist(movieData, token);
      return result;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      const errorMessage = error.message || 'Failed to add to watchlist';
      
      // Check for duplicate error
      if (errorMessage.includes('already in watchlist')) {
        return thunkAPI.rejectWithValue('Movie is already in your watchlist');
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Remove from watchlist
export const removeFromWatchlist = createAsyncThunk(
  'movies/removeFromWatchlist',
  async (movieId, thunkAPI) => {
    try {
      if (!movieId) {
        return thunkAPI.rejectWithValue('Movie ID is required');
      }
      
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      // Ensure movieId is a number
      const numericId = Number(movieId);
      if (isNaN(numericId)) {
        return thunkAPI.rejectWithValue('Invalid movie ID format');
      }
      
      console.log('Removing from watchlist, ID:', numericId);
      await movieService.removeFromWatchlist(numericId, token);
      return { removedId: numericId };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearMovie: (state) => {
      state.movie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get trending movies
      .addCase(getTrendingMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trendingMovies = action.payload;
      })
      .addCase(getTrendingMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.trendingMovies = [];
      })
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get movie details
      .addCase(getMovieDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movie = action.payload;
      })
      .addCase(getMovieDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // --- FAVORITES CASES ---
      
      // Get favorites
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // Add to favorites
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the movie with the matching tmdbId
        state.favorites = state.favorites.filter(
          movie => movie.tmdbId !== action.payload.removedId
        );
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // --- WATCHLIST CASES ---
      
      // Get watchlist
      .addCase(getWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = action.payload;
      })
      .addCase(getWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // Add to watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist.push(action.payload);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      
      // Remove from watchlist
      .addCase(removeFromWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the movie with the matching tmdbId
        state.watchlist = state.watchlist.filter(
          movie => movie.tmdbId !== action.payload.removedId
        );
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { reset, clearMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
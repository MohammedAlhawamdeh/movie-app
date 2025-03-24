import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import reviewsReducer from './slices/reviewsSlice';

// Vite provides import.meta.env instead of process.env
const isDevelopment = import.meta.env.MODE === 'development';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
    theme: themeReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/logout'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['movies.error', 'auth.error'],
      },
    }),
  devTools: isDevelopment,
});

// Redux Hooks types
export const getState = store.getState;
export const dispatch = store.dispatch;

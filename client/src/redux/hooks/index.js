import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Custom hook for movie state
export const useMovies = () => useSelector((state) => state.movies);

// Custom hook for auth state
export const useAuth = () => useSelector((state) => state.auth);

// Custom hook to check if user is logged in
export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

// Custom hook to get current user
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

// Custom hook for trending movies
export const useTrendingMovies = () => {
  const { trendingMovies, isLoading, isError, message } = useMovies();
  return { trendingMovies, isLoading, isError, message };
};

// Custom hook for movie details
export const useMovieDetails = () => {
  const { movie, isLoading, isError, message } = useMovies();
  return { movie, isLoading, isError, message };
};

// Custom hook for favorites
export const useFavorites = () => {
  const { favorites } = useMovies();
  return favorites;
};

// Custom hook for watchlist
export const useWatchlist = () => {
  const { watchlist } = useMovies();
  return watchlist;
};

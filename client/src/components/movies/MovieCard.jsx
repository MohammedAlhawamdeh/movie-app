import { Link } from 'react-router-dom';
import { useAppDispatch, useAuth } from '../../redux/hooks';
import { addToFavorites, addToWatchlist } from '../../redux/slices/moviesSlice';
import { useNotification } from '../../context/NotificationContext';

const MovieCard = ({ movie }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleAddToFavorites = async () => {
    if (!user) {
      showNotification('Please login to add to favorites', 'warning');
      return;
    }

    try {
      await dispatch(addToFavorites(movie)).unwrap();
      showNotification('Movie added to favorites!', 'success');
    } catch (error) {
      // Handle the case where the movie is already in favorites
      if (error && typeof error === 'string' && error.includes('already in your favorites')) {
        showNotification(error, 'info');
      } else {
        showNotification(error || 'Failed to add to favorites', 'error');
      }
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      showNotification('Please login to add to watchlist', 'warning');
      return;
    }

    try {
      await dispatch(addToWatchlist(movie)).unwrap();
      showNotification('Movie added to watchlist!', 'success');
    } catch (error) {
      // Handle the case where the movie is already in watchlist
      if (error && typeof error === 'string' && error.includes('already in your watchlist')) {
        showNotification(error, 'info');
      } else {
        showNotification(error || 'Failed to add to watchlist', 'error');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link to={`/movies/${movie.tmdbId || movie.id}`}>
        <div className="relative pb-[150%]">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="absolute w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/movies/${movie.tmdbId || movie.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 truncate">
            {movie.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
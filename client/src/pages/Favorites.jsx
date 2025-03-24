import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites, removeFromFavorites } from '../redux/slices/moviesSlice';
import MovieCard from '../components/movies/MovieCard';
import { useNotification } from '../context/NotificationContext';

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites, isLoading, isError, message } = useSelector((state) => state.movies);
  const { showNotification } = useNotification();

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = async (movieId) => {
    if (!movieId) {
      console.error('Cannot remove from favorites: Movie ID is undefined');
      showNotification('Failed to remove from favorites: Invalid movie ID', 'error');
      return;
    }
    
    console.log('Removing movie ID from favorites:', movieId);
    try {
      await dispatch(removeFromFavorites(movieId)).unwrap();
      showNotification('Removed from favorites', 'success');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      showNotification(error.message || 'Failed to remove from favorites', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your favorites list is empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard movie={movie} />
              <button
                onClick={() => {
                  // Detailed logging of the entire movie object
                  console.log('Removing favorite movie - FULL DETAILS:', JSON.stringify(movie, null, 2));
                  console.log('Movie ID types - id:', typeof movie.id, 'tmdbId:', typeof movie.tmdbId);
                  
                  // Try all possible ID formats available in the movie object
                  let movieId = null;
                  if (movie._id) movieId = movie._id;
                  else if (movie.id) movieId = movie.id;
                  else if (movie.tmdbId) movieId = movie.tmdbId;
                  
                  console.log('Using movieId:', movieId);
                  handleRemoveFromFavorites(movieId);
                }}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from favorites"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

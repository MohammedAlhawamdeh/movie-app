import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingMovies } from '../redux/slices/moviesSlice';
import { useAppDispatch, useTrendingMovies } from '../redux/hooks';
import { useNotification } from '../context/NotificationContext';
import MovieCard from '../components/movies/MovieCard';

const Home = () => {
  const dispatch = useAppDispatch();
  const { trendingMovies, isLoading, isError, message } = useTrendingMovies();
  const { showNotification } = useNotification();

  useEffect(() => {
    console.log('Fetching trending movies...');
    dispatch(getTrendingMovies())
      .unwrap()
      .catch((error) => {
        console.error('Error fetching trending movies:', error);
        showNotification(error, 'error');
      });
  }, [dispatch, showNotification]);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Movies</h1>
        <Link
          to="/movies"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View All Movies
        </Link>
      </div>

      {trendingMovies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

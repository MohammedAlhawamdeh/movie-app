import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import movieService from '../../services/movieService';

const categories = [
  { id: 'popular', name: 'Popular', endpoint: 'popular' },
  { id: 'top_rated', name: 'Top Rated', endpoint: 'top_rated' },
  { id: 'now_playing', name: 'Now Playing', endpoint: 'now_playing' },
  { id: 'upcoming', name: 'Upcoming', endpoint: 'upcoming' },
];

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const MovieCategories = () => {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeGenre, setActiveGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [activeCategory, activeGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (activeGenre) {
        response = await movieService.discoverMovies({ with_genres: activeGenre });
      } else {
        const category = categories.find(c => c.id === activeCategory);
        if (!category) throw new Error('Invalid category');
        response = await movieService.discoverMovies({ sort_by: `${category.endpoint}.desc` });
      }

      setMovies(response.results?.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview
      })) || []);
    } catch (err) {
      const errorMessage = err.response?.data?.status_message || err.message || 'Failed to fetch movies';
      setError(errorMessage);
      console.error('Error fetching movies:', {
        message: errorMessage,
        activeCategory,
        activeGenre,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveGenre(null);
  };

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setActiveCategory(null);
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Browse Movies</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <details className="bg-gray-100 dark:bg-gray-800 rounded-lg">
            <summary className="cursor-pointer p-3 font-medium text-gray-700 dark:text-gray-300">
              Browse By Genre {activeGenre && `(${genres.find(g => g.id === activeGenre)?.name})`}
            </summary>
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeGenre === genre.id
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          to={activeGenre ? `/genre/${activeGenre}` : `/category/${activeCategory}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default MovieCategories;
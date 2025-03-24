import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../redux/slices/moviesSlice';
import MovieCard from '../components/movies/MovieCard';
import CategoryFilter from '../components/movies/CategoryFilter';

const Movies = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { movies, isLoading, isError, message } = useSelector((state) => state.movies);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [releaseYear, setReleaseYear] = useState('');
  const searchQuery = searchParams.get('query') || searchParams.get('search');

  useEffect(() => {
    // Reset category when search query changes
    if (searchQuery) {
      setSelectedCategory('all');
    }
  }, [searchQuery]);

  useEffect(() => {
    const options = {
      ...(searchQuery && { query: searchQuery }),
      ...(selectedCategory !== 'all' && { category: selectedCategory }),
      sort_by: sortBy,
      ...(releaseYear && { year: releaseYear }),
    };
    dispatch(fetchMovies(options));
  }, [dispatch, searchQuery, selectedCategory, sortBy, releaseYear]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleYearChange = (e) => {
    setReleaseYear(e.target.value);
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Movies'}
        </h1>
        
        <div className="space-y-4">
            {!searchQuery && <CategoryFilter onCategoryChange={handleCategoryChange} />}
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="popularity.desc">Popularity (High to Low)</option>
                  <option value="popularity.asc">Popularity (Low to High)</option>
                  <option value="vote_average.desc">Rating (High to Low)</option>
                  <option value="vote_average.asc">Rating (Low to High)</option>
                  <option value="release_date.desc">Release Date (Newest)</option>
                  <option value="release_date.asc">Release Date (Oldest)</option>
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Year</label>
                <select
                  value={releaseYear}
                  onChange={handleYearChange}
                  className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
      </div>

      {!movies || !movies.results || movies.results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {searchQuery
              ? 'No movies found matching your search.'
              : 'No movies found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.results.map((movie) => (
            <MovieCard key={movie.id || movie.tmdbId || movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
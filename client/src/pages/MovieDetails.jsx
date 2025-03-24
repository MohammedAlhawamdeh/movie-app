import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getMovieDetails, 
  clearMovie, 
  addToFavorites, 
  addToWatchlist 
} from '../redux/slices/moviesSlice';
import { getMovieReviews } from '../redux/slices/reviewsSlice';
import { useNotification } from '../context/NotificationContext';
import ReviewSection from '../components/movies/ReviewSection';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { movie, isLoading, isError, message } = useSelector(state => state.movies);
  const { user } = useSelector(state => state.auth);
  const { showNotification } = useNotification();
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    console.log('Fetching movie details for ID:', id);
    
    // Determine if we're dealing with a TMDB ID or other ID type
    // TMDB IDs are always numeric and typically 5-7 digits
    console.log(`Attempting to fetch movie details for ID: ${id}`);
    
    // Make sure id is a valid format before dispatching
    if (!id || id === 'undefined' || id === 'null') {
      showNotification('Invalid movie ID', 'error');
      return;
    }
    
    // Fetch the movie details
    dispatch(getMovieDetails(id))
      .unwrap()
      .then((data) => {
        console.log('Successfully fetched movie details:', data);
        // Check for trailers specifically
        if (data && (!data.videos || !data.videos.results || data.videos.results.length === 0)) {
          console.log('No trailers found for this movie');
        }
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        // More user-friendly error message
        showNotification(`Could not find movie: ${error.toString().replace('Error: ', '')}`, 'error');
      });

    dispatch(getMovieReviews(id))
      .unwrap()
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });

    return () => {
      dispatch(clearMovie());
    };
  }, [id, dispatch, showNotification]);

  const handleAddToFavorites = () => {
    if (!user) {
      showNotification('Please log in to add to favorites', 'info');
      return;
    }

    // Make sure we're using tmdbId consistently
    const movieData = {
      id: movie.id || movie.tmdbId, // TMDB API returns 'id'
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    };

    console.log('Adding to favorites with data:', movieData);

    dispatch(addToFavorites(movieData))
      .unwrap()
      .then(() => {
        showNotification('Movie added to favorites', 'success');
      })
      .catch((error) => {
        // Check for duplicate error specifically
        if (error.includes('already in favorites')) {
          showNotification('This movie is already in your favorites', 'info');
        } else {
          showNotification(error, 'error');
        }
      });
  };

  const handleAddToWatchlist = () => {
    if (!user) {
      showNotification('Please log in to add to watchlist', 'info');
      return;
    }

    // Make sure we're using tmdbId consistently
    const movieData = {
      id: movie.id || movie.tmdbId, // TMDB API returns 'id'
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    };

    console.log('Adding to watchlist with data:', movieData);

    dispatch(addToWatchlist(movieData))
      .unwrap()
      .then(() => {
        showNotification('Movie added to watchlist', 'success');
      })
      .catch((error) => {
        // Check for duplicate error specifically
        if (error.includes('already in watchlist')) {
          showNotification('This movie is already in your watchlist', 'info');
        } else {
          showNotification(error, 'error');
        }
      });
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

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Movie Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Movie Poster */}
        <div className="md:w-1/3">
          {movie?.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-[600px] bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>
          {movie?.tagline && (
            <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-4">{movie.tagline}</p>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300">{movie?.overview}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Release Date</h3>
              <p>{movie?.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Rating</h3>
              <p>{movie?.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Runtime</h3>
              <p>{movie?.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Vote Count</h3>
              <p>{movie?.vote_count || 'N/A'}</p>
            </div>
          </div>

          {movie?.genres && movie.genres.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Section */}
      {movie?.videos?.results?.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trailer</h2>
          <div className="aspect-w-16 aspect-h-9">
            {/* Filter to only find trailer-type videos */}
            {(() => {
              const trailers = movie.videos.results.filter(video => 
                video.site === 'YouTube' && 
                (video.type === 'Trailer' || video.type === 'Teaser')
              );
              
              // Use first trailer, or any video if no trailers
              const videoToUse = trailers.length > 0 
                ? trailers[0] 
                : movie.videos.results[0];
              
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoToUse.key}`}
                  title={videoToUse.name || "Movie Trailer"}
                  allowFullScreen
                  className="w-full rounded-lg shadow-lg"
                  height="500"
                  width="100%"
                ></iframe>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Trailer</h2>
          <p className="text-gray-600 dark:text-gray-300">No trailer available for this movie.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handleAddToFavorites}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Add to Favorites
        </button>
        
        <button
          onClick={handleAddToWatchlist}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Add to Watchlist
        </button>
        
        <button
          onClick={() => setShowRatingModal(true)}
          className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Rate This Movie
        </button>
      </div>

      {/* Reviews Section */}
      {movie && <ReviewSection movieId={id} movieDetails={movie} />}
    </div>
  );
};

export default MovieDetails;

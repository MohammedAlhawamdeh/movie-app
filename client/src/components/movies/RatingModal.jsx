import { useState } from 'react';
import { useSelector } from 'react-redux';

const RatingModal = ({ movie, onClose, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [comment, setComment] = useState('');

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      movieId: movie.id, 
      rating, 
      comment,
      reviewerName 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rate this movie</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              className="w-16 h-auto rounded-md mr-3"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{movie.title}</h3>
          </div>
        </div>

        <form onSubmit={handleRatingSubmit} className="space-y-4">
          {/* Reviewer Name Field */}
          <div>
            <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name:
            </label>
            <input
              type="text"
              id="reviewerName"
              className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
            />
          </div>

          {/* Star Rating */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Your rating:</p>
            <div className="flex items-center space-x-1">
              {[...Array(10)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <svg
                      className={`h-8 w-8 ${
                        (hoveredRating || rating) >= starValue
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                );
              })}
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{hoveredRating || rating || ''}</span>
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your review (optional):
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts about the movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating || !reviewerName.trim()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
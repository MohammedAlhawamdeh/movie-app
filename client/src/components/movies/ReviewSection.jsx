import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getMovieReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} from '../../redux/slices/reviewsSlice';
import { useNotification } from '../../context/NotificationContext';
import ReviewForm from './ReviewForm';

const ReviewSection = ({ movieId, movieDetails }) => {
  const dispatch = useDispatch();
  const { movieReviews, isLoading, isError, message } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    dispatch(getMovieReviews(movieId));
  }, [dispatch, movieId]);

  const handleSubmitReview = async (reviewData) => {
    try {
      await dispatch(createReview({
        movieId,
        reviewData: {
          ...reviewData,
          movie: {
            title: movieDetails.title,
            poster_path: movieDetails.poster_path,
            release_date: movieDetails.release_date,
          },
        },
      })).unwrap();
      
      showNotification('Review submitted successfully', 'success');
      
      // Refresh the reviews
      dispatch(getMovieReviews(movieId));
    } catch (error) {
      showNotification(error.message || 'Failed to submit review', 'error');
    }
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      if (!editingReview) return;
      
      await dispatch(updateReview({
        reviewId: editingReview._id,
        reviewData
      })).unwrap();
      
      showNotification('Review updated successfully', 'success');
      setEditingReview(null);
      dispatch(getMovieReviews(movieId));
    } catch (error) {
      showNotification(error.message || 'Failed to update review', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      showNotification('Review deleted successfully', 'success');
      setEditingReview(null);
      dispatch(getMovieReviews(movieId));
    } catch (error) {
      showNotification(error.message || 'Failed to delete review', 'error');
    }
  };

  // Check if the current user is the author of the review or an admin
  const canModifyReview = (review) => {
    if (!user) return false;
    return user._id === review.user?._id || user.isAdmin;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Reviews</h2>

      {/* Review Form - Only show if not currently editing */}
      {!editingReview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Write a Review
          </h3>
          <ReviewForm onSubmit={handleSubmitReview} />
        </div>
      )}

      {/* Edit Review Form */}
      {editingReview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border-2 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Your Review
            </h3>
            <button 
              onClick={() => setEditingReview(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
          <ReviewForm 
            onSubmit={handleUpdateReview} 
            existingReview={editingReview}
            onDelete={handleDeleteReview}
          />
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-100 mb-4">
          <span className="block sm:inline">{message}</span>
        </div>
      ) : movieReviews?.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">No reviews yet. Be the first to review this movie!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {movieReviews.map((review) => (
            <div key={review._id} className={`
              bg-white dark:bg-gray-800 rounded-lg shadow-md p-6
              ${editingReview?._id === review._id ? 'opacity-50' : ''}
            `}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center mr-3
                    ${review.rating >= 4 
                      ? 'bg-green-600 dark:bg-green-500' 
                      : review.rating >= 3 
                      ? 'bg-yellow-600 dark:bg-yellow-500' 
                      : 'bg-red-600 dark:bg-red-500'
                    }
                    text-white font-bold
                  `}>
                    {review.rating}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {review.user?.name || 'Anonymous'}
                      {review.user?._id === user?._id && 
                        <span className="ml-2 text-sm text-blue-500">(You)</span>
                      }
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  
                  {/* Edit/Delete buttons for user's own reviews or admin */}
                  {canModifyReview(review) && !editingReview && (
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => setEditingReview(review)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this review?')) {
                            handleDeleteReview(review._id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {review.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
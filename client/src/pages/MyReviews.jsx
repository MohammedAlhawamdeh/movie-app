import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyReviews, deleteReview } from "../redux/slices/reviewsSlice";
import { useNotification } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../config/tmdb";

const MyReviews = () => {
  const dispatch = useDispatch();
  const { myReviews, isLoading, isError, message } = useSelector(
    (state) => state.reviews
  );

  const { user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();

  useEffect(() => {
    dispatch(getMyReviews());
  }, [dispatch]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
        showNotification("Review deleted successfully", "success");
      } catch (error) {
        showNotification(error.message || "Failed to delete review", "error");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        My Reviews
      </h1>

      {isError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
      ) : myReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            You haven't written any reviews yet.
          </p>
          <Link
            to="/movies"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {myReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie poster */}
                  <div className="w-full md:w-48 flex-shrink-0">
                    <Link to={`/movie/${review.movieId}`}>
                      <img
                        src={getImageUrl(
                          review.movie?.poster_path,
                          "w342",
                          "poster"
                        )}
                        alt={review.movie?.title}
                        className="w-full h-auto rounded-md"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Review content */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link
                          to={`/movie/${review.movieId}`}
                          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {review.movie?.title}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reviewed on {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${
                            review.rating >= 4
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : review.rating >= 3
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }
                        `}
                        >
                          {review.rating} / 5
                        </span>
                        {console.log(review)}
                        {(user.isAdmin || user._id === review.user) && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                            title="Delete review"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;

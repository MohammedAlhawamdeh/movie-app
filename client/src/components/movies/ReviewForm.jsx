import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// ReviewForm component can be used for both creating new reviews and editing existing ones
const ReviewForm = ({ onSubmit, existingReview = null, onDelete = null }) => {
  const { user } = useSelector((state) => state.auth);
  
  // If we have an existing review, pre-populate the form with its data
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 5,
    title: existingReview?.title || '',
    content: existingReview?.content || '',
  });

  const isEditing = !!existingReview;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Only reset the form if not editing (i.e., creating a new review)
    if (!isEditing) {
      setFormData({ rating: 5, title: '', content: '' });
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, rating: i })}
          className="focus:outline-none"
        >
          <svg
            className={`h-6 w-6 ${
              i <= formData.rating
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
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please log in to write a review
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Login to Review
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating
        </label>
        {renderStars()}
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Review Title
        </label>
        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Summarize your thoughts in a few words..."
          required
        />
      </div>

      <div>
        <label
          htmlFor="review-content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="review-content"
          rows="4"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your thoughts about this movie..."
          required
        ></textarea>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isEditing ? 'Update Review' : 'Submit Review'}
        </button>
        
        {isEditing && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this review?')) {
                onDelete(existingReview._id);
              }
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Review
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
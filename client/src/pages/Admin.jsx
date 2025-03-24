import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import authService from '../services/authService';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user exists
    if (!user) {
      showNotification('Login required for admin access', 'error');
      navigate('/login');
      return;
    }

    // Verify admin status with the server
    const verifyAdmin = async () => {
      try {
        const isAdmin = await authService.verifyAdmin();
        if (!isAdmin) {
          showNotification('Admin access required', 'error');
          navigate('/');
          return;
        }
        // If admin verification successful, fetch data
        fetchAdminData();
      } catch (error) {
        showNotification('Admin verification failed', 'error');
        navigate('/');
      }
    };

    verifyAdmin();
  }, [user, navigate, showNotification]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reviewsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/reviews'),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error fetching admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      showNotification('User deleted successfully', 'success');
      fetchAdminData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error deleting user', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`/api/admin/reviews/${reviewId}`);
      showNotification('Review deleted successfully', 'success');
      fetchAdminData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error deleting review', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 ${
            activeTab === 'reviews'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.users}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total Reviews</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.reviews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Admin Users</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
          </div>
        </div>
      )}

      {/* Users List */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.isAdmin
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {review.movie?.title || 'Unknown Movie'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {review.user?.name || 'Anonymous'} • {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Rating: {review.rating}/5
                  </span>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNotification } from '../context/NotificationContext';
import authService from '../services/authService';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        setIsVerified(false);
        setIsLoading(false);
        return;
      }

      try {
        const verified = await authService.verifyAdmin();
        setIsVerified(verified);
      } catch (error) {
        console.error('Admin verification error:', error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !isVerified) {
    showNotification('Admin access required', 'error');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
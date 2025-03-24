import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNotification } from '../context/NotificationContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();

  if (!user) {
    showNotification('Please log in to access this page', 'warning');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
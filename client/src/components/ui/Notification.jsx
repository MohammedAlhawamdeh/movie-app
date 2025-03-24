import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-900 dark:bg-green-800 dark:border-green-600 dark:text-green-100';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-900 dark:bg-red-800 dark:border-red-600 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-800 dark:border-yellow-600 dark:text-yellow-100';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-800 dark:border-blue-600 dark:text-blue-100';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <div className={`border-l-4 p-4 shadow-md rounded ${getTypeStyles()}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">{getIcon()}</div>
          <div>
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
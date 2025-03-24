import { Component } from 'react';
import { isProduction } from '../utils/environment';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, error: err };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Oops! Something went wrong
              </h2>
              
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We've encountered an unexpected error. Please try refreshing the page.
              </p>

              {!isProduction && this.state.error && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-left">
                  <p className="text-sm font-mono text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                  </p>
                  <pre className="mt-2 text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
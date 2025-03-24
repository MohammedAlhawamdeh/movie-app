import { useState, useEffect } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [health, setHealth] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test the health endpoint
        console.log('Testing health endpoint...');
        const healthRes = await axios.get('/api/health');
        setHealth(healthRes.data);
        console.log('Health response:', healthRes.data);

        // Test the test endpoint
        console.log('Testing test endpoint...');
        const testRes = await axios.get('/api/test');
        setTestResponse(testRes.data);
        console.log('Test response:', testRes.data);
        
        // Test trending movies endpoint
        console.log('Testing trending movies endpoint...');
        const trendingRes = await axios.get('/api/movies/trending');
        console.log('Trending movies response:', trendingRes.data);
        
        // Test discover movies endpoint
        console.log('Testing discover movies endpoint...');
        const discoverRes = await axios.get('/api/movies/discover');
        console.log('Discover movies response:', discoverRes.data);

      } catch (err) {
        console.error('API Test Error:', err);
        setError(err.message || 'An error occurred testing the API');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">API Connection Test</h1>

      {loading ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p>Testing API connection...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error testing API</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold">API Connection Success!</h2>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Health Check Result:</h2>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Test Endpoint Result:</h2>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Debug Info</h2>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>If this test is successful but other API calls fail, check:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Server routes are properly configured for movie API endpoints</li>
                <li>TMDB API key is properly set in the server environment</li>
                <li>Server controllers are correctly handling the movie requests</li>
                <li>Check browser console for any CORS or other network errors</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestApi;
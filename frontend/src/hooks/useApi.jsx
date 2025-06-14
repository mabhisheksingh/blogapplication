import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiCall - The API function to call
 * @returns {Array} [execute, loading, error, data]
 */
const useApi = (apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(...args);
      setData(response.data);
      return response;
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return [execute, { loading, error, data }];
};

export default useApi;

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for implementing infinite scroll functionality
 * @param {Function} fetchMore - Function to fetch more data
 * @param {Object} options - Configuration options
 * @param {boolean} options.hasMore - Whether there are more items to load
 * @param {number} options.threshold - Distance from bottom of page to trigger loading (in pixels)
 * @param {boolean} options.initialLoad - Whether to load initial data
 * @returns {Object} Infinite scroll state and helpers
 */
const useInfiniteScroll = (fetchMore, { 
  hasMore = true, 
  threshold = 100, 
  initialLoad = true 
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const loadingRef = useRef(false);
  
  // Reset state when dependencies change
  const reset = useCallback(() => {
    setPage(1);
    setIsLoading(false);
    setError(null);
    loadingRef.current = false;
  }, []);

  // Load more items
  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current || !hasMore) return;
    
    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      await fetchMore(page);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error('Error loading more items:', err);
      setError(err.message || 'Failed to load more items');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchMore, hasMore, page]);

  // Set up intersection observer for infinite scroll
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      
      // Disconnect previous observer
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMore();
          }
        },
        { threshold: 0.1, rootMargin: `${threshold}px` }
      );
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore, threshold]
  );

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      loadMore();
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [initialLoad, loadMore]);

  return {
    isLoading,
    error,
    page,
    lastItemRef,
    reset,
    loadMore,
    hasMore,
  };
};

export default useInfiniteScroll;

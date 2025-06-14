import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

// Determine API base URL – strip any trailing /api to avoid double paths like /api/v1/api
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9001/api';
const API_URL = rawBaseUrl.replace(/\/api$/i, '');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a wrapper function to get the API instance with interceptors
export const getApi = () => {
  const { keycloak, initialized } = useKeycloak();
  
  // Add request interceptor to add auth token to requests
  api.interceptors.request.use(
    async (config) => {
      // Skip auth header for public endpoints
      const isPublic = config.url?.startsWith('/v1/api/public/') || 
                      config.url?.startsWith('/api/public/') ||
                      config.url?.includes('keycloak');
      
      if (isPublic) return config;

      // Ensure keycloak is initialized and authenticated
      if (initialized && keycloak?.authenticated) {
        try {
          // Force token update if it's about to expire (within 5 minutes)
          await keycloak.updateToken(300);
          
          // Set the Authorization header
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          keycloak.login();
          return Promise.reject('Failed to refresh token');
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle retries and 401 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If we get a 401, try to refresh the token
      if (error.response?.status === 401) {
        try {
          if (keycloak) {
            await keycloak.updateToken();
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          keycloak.login();
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors with retry logic
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = originalRequest._retryCount || 0;
      }

      // Only retry on network errors or 5xx server errors (except 501)
      const isNetworkError = !error.response;
      const isServerError = error.response && error.response.status >= 500 && error.response.status !== 501;
      const shouldRetry = (isNetworkError || isServerError) && originalRequest._retryCount < 5;

      if (shouldRetry) {
        originalRequest._retryCount += 1;
        console.log(`Retry attempt ${originalRequest._retryCount} for ${originalRequest.url}`);
        
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = Math.min(1000 * Math.pow(2, originalRequest._retryCount - 1), 30000);
        
        return new Promise(resolve => {
          setTimeout(() => resolve(api(originalRequest)), delay);
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Create a function to generate API methods with the current API instance
const createApiMethods = (api) => ({
  // USER APIs
  usersAPI: {
    getUserById: (userId) => api.get(`/v1/api/user/users/${userId}`),
    updateUser: (userId, data) => api.put(`/v1/api/user/users/${userId}`, data),
    // Public create user endpoint (no auth required)
    createUserPublic: (data) => api.post('/v1/api/public/create-user', data),
    // Admin create user endpoint
    createUserAdmin: (data) => api.post('/v1/api/admin/create-user', data),
    getUsersPaginated: (params) => api.get('/v1/api/admin/users', { params }),
    getUserAdminById: (id) => api.get(`/v1/api/admin/users/${id}`),
    getAllUsers: () => api.get('/v1/api/admin/users-without-page'),
    deleteUserByUsername: (username) => api.delete(`/v1/api/admin/users/${username}`),
  },

  // BLOG APIs (exposed as postsAPI for backwards-compatibility with existing components)
  postsAPI: {
    // GET /v1/api/blog
    getAllPosts: (params) => api.get('/v1/api/blog', { params }),
    // GET /v1/api/blog/{id}
    getPostById: (id) => api.get(`/v1/api/blog/${id}`),
    // POST /v1/api/blog/create
    createPost: (data) => api.post('/v1/api/blog/create', data),
    // PUT /v1/api/blog/{id}
    updatePost: (id, data) => api.put(`/v1/api/blog/${id}`, data),
    // DELETE /v1/api/blog/{id}
    deletePost: (id) => api.delete(`/v1/api/blog/${id}`),
  },

  // COMMENT APIs
  commentsAPI: {
    // GET /api/comments/post/{postId}?pageable=...  (params can include pageable)
    getCommentsByPostId: (postId, params) => api.get(`/api/comments/post/${postId}`, { params }),
    // POST /api/comments  – body should include { postId, content, parentId? }
    addComment: (postId, data) => api.post('/api/comments', { postId, ...data }),
    // DELETE /api/comments/{id}
    deleteComment: (commentId) => api.delete(`/api/comments/${commentId}`),
    // PUT /api/comments/{id}
    updateComment: (commentId, data) => api.put(`/api/comments/${commentId}`, data),
    // Additional helpers
    getCommentTree: (postId) => api.get(`/api/comments/post/${postId}/tree`),
    getCommentCount: (postId) => api.get(`/api/comments/post/${postId}/count`),
  },

  // Auth API
  authAPI: {
    // Initiate Keycloak login
    login: (options) => {
      const { keycloak } = useKeycloak();
      return keycloak.login(options);
    },
    // Public user registration
    register: (data) => api.post('/v1/api/public/create-user', data),
    // Fetch current user details
    getCurrentUser: () => api.get('/v1/api/user/me')
  }
});

// Create a custom hook to use the API
const useApi = () => {
  const api = getApi();
  return createApiMethods(api);
};

// For backward compatibility, create default exports
const defaultApi = createApiMethods(api);
const { usersAPI, postsAPI, commentsAPI, authAPI } = defaultApi;

// Export everything needed
export const exportedAPI = {
  ...usersAPI,
  ...commentsAPI,
  authAPI
};

export { usersAPI, postsAPI, commentsAPI, authAPI, useApi };
export default exportedAPI;

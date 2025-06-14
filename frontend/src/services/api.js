import axios from 'axios';
import keycloak from '../keycloak';

// Determine API base URL – strip any trailing /api to avoid double paths like /api/v1/api
const rawBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:9001/api';
const API_URL = rawBaseUrl.replace(/\/api$/i, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Skip auth header for public endpoints if desired
    const isPublic = config.url?.startsWith('/v1/api/public/') || config.url?.startsWith('/api/public/');
    if (isPublic) return config;

    if (keycloak?.token) {
      try {
        // Refresh token if it's about to expire in the next 30 seconds
        await keycloak.updateToken(30);
      } catch (err) {
        console.warn('Token refresh failed, forcing login');
        return keycloak.login();
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Keycloak should refresh tokens automatically, but if refresh fails redirect to login
      keycloak.logout({ redirectUri: window.location.origin });
    }
    return Promise.reject(error);
  }
);

// USER APIs
export const usersAPI = {
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
};

// BLOG APIs (exposed as postsAPI for backwards-compatibility with existing components)
export const postsAPI = {
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
};

// COMMENT APIs
export const commentsAPI = {
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
};

// Optionally export default instance
export default api;

// Legacy compatibility exports for existing components expecting authAPI
export const authAPI = {
  // Initiate Keycloak login, returns a promise that resolves after redirect
  login: (options) => {
    // Keycloak login triggers redirect; return promise for interface compatibility
    return keycloak.login(options);
  },
  // Public user registration maps to new public create-user endpoint
  register: usersAPI.createUserPublic,
  // Fetch current user details – requires you to know user ID; alternatively hit a dedicated endpoint if available
  getCurrentUser: () => api.get('/v1/api/user/me'), // adjust backend if different
};

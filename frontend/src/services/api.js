import axios from 'axios';

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

// Create a function to generate API methods with the current API instance
const createApiMethods = (api) => ({
  // USER APIs
  usersAPI: {
    getUserById: (userId) => api.get(`/v1/api/user/users/${userId}`),
    getUserByUsername: (username) => api.get(`/v1/api/user/users/${username}`),
    updateUser: (userId, data) => api.put(`/v1/api/user/users/${userId}`, data),
    // Public create user endpoint (no auth required)
    createUserPublic: (data) => api.post('/v1/api/public/create-user', data),
    // Admin create user endpoint
    createUserAdmin: (data) => api.post('/v1/api/admin/create-user', data),
    getUsersPaginated: (params) => api.get('/v1/api/admin/users', { params }),
    getUserAdminById: (id) => api.get(`/v1/api/admin/users/${id}`),
    getAllUsers: () => api.get('/v1/api/admin/users-without-page'),
    deleteUserByUsername: (username) => api.delete(`/v1/api/admin/users/${username}`),
    toggleEnable: (userId, status, config = {}) => api.patch(`/v1/api/admin/users/${userId}/status?status=${status}`, {}, config),
    resendVerificationEmail: (username, config = {}) => api.get(`/v1/api/admin/users/${username}/resend-email`, config),
  },

  // POST APIs (exposed as postsAPI for backwards-compatibility with existing components)
  postsAPI: {
    // GET /v1/api/post
    getAllPosts: async (params) => {
      const response = await api.get('/v1/api/post', { params });
      // Transform the response to ensure consistent data structure
      const posts = Array.isArray(response.data) ? response.data : [];
      return {
        ...response,
        data: posts.map(post => ({
          id: post.id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          imageUrl: post.imageUrl,
          authorUsername: post.authorUsername || (post.author ? post.author.username : null),
          categories: post.categories || [],
          tags: post.tags || [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt || post.createdAt,
          status: post.status || 'PUBLISHED'
        }))
      };
    },
    
    // GET /v1/api/post/{id}
    getPostById: async (id) => {
      const response = await api.get(`/v1/api/post/${id}`);
      const post = response.data;
      return {
        ...response,
        data: {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          content: post.content,
          imageUrl: post.imageUrl,
          authorUsername: post.authorUsername || (post.author ? post.author.username : null),
          categories: post.categories || [],
          tags: post.tags || [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt || post.createdAt,
          status: post.status || 'PUBLISHED'
        }
      };
    },
    
    // POST /v1/api/post/create
    createPost: (data) => {
      // Transform categories and tags to match backend expectations
      const postData = {
        ...data,
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      return api.post('/v1/api/post/create', postData);
    },
    
    // PUT /v1/api/post/{id}
    updatePost: (id, data) => {
      // Transform categories and tags to match backend expectations
      const postData = {
        ...data,
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      return api.put(`/v1/api/post/${id}`, postData);
    },
    
    // DELETE /v1/api/post/{id}
    deletePost: (id) => api.delete(`/v1/api/post/${id}`),
    
    // GET /v1/api/post/categories
    getCategories: async () => {
      const response = await api.get('/v1/api/post/categories');
      // Ensure we always return an array of categories
      const categories = Array.isArray(response.data) ? response.data : [];
      return {
        ...response,
        data: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || ''
        }))
      };
    },
  },

  // COMMENT APIs
  commentsAPI: {
    // GET /v1/api/comment/post/{postId}?pageable=...  (params can include pageable)
    getCommentsByPostId: (postId, params) => api.get(`/v1/api/comment/post/${postId}`, { params }),
    // POST /v1/api/comment  – body should include { postId, comment, edited }
    addComment: (postId, data) => api.post('/v1/api/comment', { 
      postId,
      comment: data.content,
      edited: data.edited || false 
    }),
    // POST /v1/api/comment/reply  – body should include { postId, parentId, comment, edited }
    addReply: (postId, parentId, content) => 
      api.post('/v1/api/comment/reply', { 
        postId, 
        parentId, 
        comment: content,
        edited: false 
      }),
    // DELETE /v1/api/comment/{id}
    deleteComment: (commentId) => api.delete(`/v1/api/comment/${commentId}`),
    // PUT /v1/api/comment/{id}
    updateComment: (commentId, data) => api.put(`/v1/api/comment/${commentId}`, data),
    // GET /v1/api/comment/tree/post/{postId}
    getCommentTree: (postId) => api.get(`/v1/api/comment/tree/post/${postId}`),
    // GET /v1/api/comment/count/post/{postId}
    getCommentCount: (postId) => api.get(`/v1/api/comment/count/post/${postId}`),
  },

  // Auth API
  authAPI: {
    // Initiate Keycloak login
    login: (options) => {
      const { keycloak } = useKeycloak();
      return keycloak.login(options);
    },
    // Public user registration
    // Fetch current user details
    getCurrentUser: () => api.get('/v1/api/user/me')
  }
});

// Create API methods with the default API instance
const { usersAPI, postsAPI, commentsAPI, authAPI } = createApiMethods(api);

// Export individual APIs
export { usersAPI, postsAPI, commentsAPI, authAPI };

// For backward compatibility
export default {
  ...usersAPI,
  ...commentsAPI,
  authAPI
};

// Accept a showError callback for global error handling
export const setupInterceptors = (keycloak, showError) => {
  // Clear any existing interceptors
  api.interceptors.request.eject();
  
  // Add request interceptor
  api.interceptors.request.use(
    config => {
      if (keycloak?.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Add response interceptor for global error handling
  api.interceptors.response.use(
    response => response,
    error => {
      const apiMsg = error?.response?.data?.message || 'An error occurred';
      if (showError) showError(apiMsg);
      return Promise.reject(error);
    }
  );

  // Return a cleanup function
  return () => {
    api.interceptors.request.eject();
    api.interceptors.response.eject();
  };
};

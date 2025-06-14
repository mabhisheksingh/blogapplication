import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportedAPI as authAPI } from '../services/api';

/**
 * Custom hook for handling authentication state and user data
 * @returns {Object} Authentication context values and methods
 */
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  // Load user data when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set the token in the API client
        authAPI.setAuthToken(token);
        
        // Fetch current user data
        const response = await authAPI.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      // Set current user
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Clear token and user data
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    
    // Clear any API auth headers
    authAPI.clearAuthToken();
    
    // Redirect to home or login page
    navigate('/login');
  }, [navigate]);

  // Update user data
  const updateUser = useCallback((userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  // Check if user has required role(s)
  const hasRole = useCallback((requiredRoles) => {
    if (!currentUser || !currentUser.roles) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some(role => currentUser.roles.includes(role));
    }
    
    return currentUser.roles.includes(requiredRoles);
  }, [currentUser]);

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    hasRole,
  };
};

export default useAuth;

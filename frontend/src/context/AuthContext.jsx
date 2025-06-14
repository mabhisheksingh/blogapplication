import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// Token storage keys
const TOKEN_KEY = 'kc_token';
const REFRESH_TOKEN_KEY = 'kc_refresh_token';
const TOKEN_EXPIRY_KEY = 'kc_token_expiry';
const MIN_VALIDITY = 70; // 70 seconds before token expiry to trigger refresh

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save tokens to localStorage
  const saveTokens = useCallback(({ token, refreshToken, expiresIn }) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      
      // Calculate token expiry time (5 minutes before actual expiry)
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
    }
    
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }, []);

  // Clear tokens from localStorage
  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }, []);

  // Initialize Keycloak and load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (keycloak?.authenticated) {
        try {
          // Save tokens to localStorage first
          if (keycloak.token) {
            saveTokens({
              token: keycloak.token,
              refreshToken: keycloak.refreshToken,
              expiresIn: keycloak.tokenParsed?.exp - Math.floor(Date.now() / 1000)
            });
          }
          
          const profile = await keycloak.loadUserProfile();
          
          setUserProfile({
            ...profile,
            roles: keycloak.tokenParsed?.realm_access?.roles || [],
            token: keycloak.token
          });
        } catch (error) {
          console.error('Failed to load user profile:', error);
          clearTokens();
        }
      } else {
        clearTokens();
        setUserProfile(null);
      }
      setLoading(false);
    };

    if (initialized) {
      loadUserProfile();
    }
  }, [keycloak, initialized, saveTokens, clearTokens]);

  // Check for existing token on initial load
  useEffect(() => {
    if (!initialized) return;
    
    const persistedToken = localStorage.getItem(TOKEN_KEY);
    if (persistedToken && !keycloak.authenticated) {
      // If we have a persisted token but keycloak isn't authenticated,
      // try to update the token from localStorage
      keycloak.init({ onLoad: 'check-sso', token: persistedToken });
    }
  }, [initialized, keycloak]);

  // Set up token refresh
  useEffect(() => {
    if (!initialized || !keycloak?.authenticated) return;

    const checkToken = async () => {
      try {
        // Check if token is about to expire
        const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
        const timeUntilExpiry = expiryTime ? parseInt(expiryTime, 10) - Date.now() : 0;
        
        if (timeUntilExpiry < MIN_VALIDITY * 1000) {
          const refreshed = await keycloak.updateToken(MIN_VALIDITY);
          if (refreshed) {
            saveTokens({
              token: keycloak.token,
              refreshToken: keycloak.refreshToken,
              expiresIn: keycloak.tokenParsed?.exp - Math.floor(Date.now() / 1000)
            });
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        keycloak.logout();
      }
    };

    // Check token every 30 seconds
    const interval = setInterval(checkToken, 30000);
    checkToken(); // Initial check

    return () => clearInterval(interval);
  }, [keycloak, initialized, saveTokens]);

  const login = useCallback(async (options) => {
    try {
      // Clear any existing tokens before login
      clearTokens();
      
      // Try to login silently first if we have a refresh token
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        const refreshed = await keycloak.updateToken(70);
        if (refreshed) {
          return true;
        }
      }
      
      // If silent login fails or no refresh token, do full login
      return keycloak.login(options);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [keycloak, clearTokens]);

  const logout = useCallback(() => {
    clearTokens();
    return keycloak.logout({ redirectUri: window.location.origin });
  }, [keycloak, clearTokens]);
  
  const getToken = useCallback(() => keycloak.token, [keycloak]);
  
  // Get persisted token (useful for initial app load)
  const getPersistedToken = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    // If we have a token but no refresh token, clear it as it's invalid
    if (token && !refreshToken) {
      clearTokens();
      return { token: null, refreshToken: null };
    }
    
    return { token, refreshToken };
  }, [clearTokens]);

  const value = {
    currentUser: userProfile,
    isAuthenticated: keycloak?.authenticated || false,
    loading: !initialized || loading,
    login,
    logout,
    getToken,
    getPersistedToken
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

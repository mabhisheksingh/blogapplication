import React, { createContext, useContext, useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (keycloak?.authenticated) {
        try {
          const profile = await keycloak.loadUserProfile();
          setUserProfile({
            ...profile,
            roles: keycloak.tokenParsed?.realm_access?.roles || [],
            token: keycloak.token
          });
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    };

    if (initialized) {
      loadUserProfile();
    }
  }, [keycloak, initialized]);

  useEffect(() => {
    if (!initialized) return;

    const refreshInterval = setInterval(() => {
      keycloak.updateToken(60).catch(err => {
        console.error('Failed to refresh token', err);
      });
    }, 6000);

    return () => clearInterval(refreshInterval);
  }, [keycloak, initialized]);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });
  const getToken = () => keycloak.token;

  const value = {
    currentUser: userProfile,
    isAuthenticated: keycloak?.authenticated || false,
    loading: !initialized || loading,
    login,
    logout,
    getToken
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

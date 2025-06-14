import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { getKeycloakInstance } from './keycloak';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

const KeycloakProviderWrapper = ({ children }) => {
  const [keycloakInstance, setKeycloakInstance] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Keycloak
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const kc = await getKeycloakInstance();
        setKeycloakInstance(kc);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize Keycloak:', err);
        setError('Failed to initialize authentication. Please try refreshing the page.');
      }
    };

    initKeycloak();
  }, []);

  // Event handlers
  const eventLogger = (event, error) => {
    console.log('Keycloak Event:', event);
    if (error) {
      console.error('Keycloak Error:', error);
    }
  };

  const tokenLogger = (tokens) => {
    console.log('Keycloak Tokens Updated:', tokens);
  };

  // Handle errors
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Authentication Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isInitialized || !keycloakInstance) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloakInstance}
      initOptions={{
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      }}
      onEvent={eventLogger}
      onTokens={tokenLogger}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

// Render the app
root.render(
  <StrictMode>
    <KeycloakProviderWrapper>
      <AuthProvider>
        <App />
      </AuthProvider>
    </KeycloakProviderWrapper>
  </StrictMode>
);

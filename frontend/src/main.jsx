import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import  { getKeycloakInstance } from './keycloak';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);
// Get the Keycloak instance (uninitialized)
const keycloakInstance = getKeycloakInstance();


  const eventLogger = (event, error) => {
    console.log('Keycloak Event:', event);
    if (error) {
      console.error('Keycloak Error:', error);
    }
  };

  const tokenLogger = (tokens) => {
    console.log('Keycloak Tokens Updated:', tokens);
  };
root.render(
    <ReactKeycloakProvider authClient={keycloakInstance} 
          initOptions={{
              onLoad: 'login-required',
              checkLoginIframe: false,
              pkceMethod: 'S256'
          }}
        onEvent={eventLogger}
        onTokens={tokenLogger}
         LoadingComponent={
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }
    ErrorComponent={({ error }) => (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Authentication Error</h4>
          <p>{error?.message || 'Failed to initialize authentication'}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )}
        
        >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactKeycloakProvider>
);

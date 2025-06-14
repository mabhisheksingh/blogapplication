import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initOptions } from './keycloak';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

keycloak.onAuthSuccess = () => {
  if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname);
  }
};


const eventLogger = (event, error) => {
  console.log('onKeycloakEvent', event
  )
  console.log('onKeycloakError', error)
}

const tokenLogger = (tokens) => {
  console.log('onKeycloakTokens', tokens)
}
root.render(
  <StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      // initOptions={initOptions}
      onEvent={eventLogger}
      onTokens={tokenLogger}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactKeycloakProvider>
  </StrictMode>
);

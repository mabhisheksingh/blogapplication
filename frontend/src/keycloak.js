
import Keycloak from 'keycloak-js';

// Configuration for Keycloak
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:9003',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'fusion-master',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'blog-auth-public'
};

/**
 * Get the Keycloak instance (for use with ReactKeycloakProvider)
 * @returns {Keycloak} A Keycloak instance (not initialized)
 */
export const getKeycloakInstance = () => {
  // Always return a fresh instance to avoid React.StrictMode double initialization issues
  return new Keycloak(keycloakConfig);
};
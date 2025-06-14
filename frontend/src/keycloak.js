
import Keycloak from 'keycloak-js';

// Configuration for Keycloak
export const keycloakConfig = new Keycloak( {
  url: 'http://localhost:9003',
  realm: 'fusion-master',
  clientId: 'blog-auth-public'
});

// Singleton pattern for Keycloak instance
// let keycloakInstance = null;
// let isInitializing = false;
// let initQueue = [];

/**
 * Get the Keycloak instance, initializing it if necessary
 * @returns {Promise<Keycloak>} A promise that resolves with the Keycloak instance
 */
// export const getKeycloakInstance = async () => {
//   // If we already have an instance, return it
//   if (keycloakInstance) {
//     return keycloakInstance;
//   }

//   // If we're already initializing, return a promise that resolves when initialization is complete
//   if (isInitializing) {
//     return new Promise((resolve) => {
//       initQueue.push(resolve);
//     });
//   }

//   // Start initialization
//   isInitializing = true;
  
//   try {
//     // Create new Keycloak instance
//     keycloakInstance = new Keycloak(keycloakConfig);
    
//     // Initialize Keycloak
//     await keycloakInstance.init({
//       onLoad: keycloakConfig.onLoad,
//       checkLoginIframe: keycloakConfig.checkLoginIframe,
//       pkceMethod: keycloakConfig.pkceMethod,
//     });

//     // Resolve all queued promises
//     initQueue.forEach(resolve => resolve(keycloakInstance));
//     initQueue = [];
    
//     return keycloakInstance;
//   } catch (error) {
//     console.error('Failed to initialize Keycloak:', error);
//     isInitializing = false;
//     keycloakInstance = null;
//     throw error;
//   }
// };

// /**
//  * Clear the Keycloak instance (useful for testing or logout)
//  */
// export const clearKeycloakInstance = () => {
//   if (keycloakInstance) {
//     keycloakInstance = null;
//     isInitializing = false;
//     initQueue = [];
//   }
// };

// // For backward compatibility
// export const keycloak = {
//   init: (options) => getKeycloakInstance(),
//   login: (options) => getKeycloakInstance().then(kc => kc.login(options)),
//   logout: (options) => getKeycloakInstance().then(kc => kc.logout(options)),
//   register: (options) => getKeycloakInstance().then(kc => kc.register(options)),
//   accountManagement: () => getKeycloakInstance().then(kc => kc.accountManagement()),
//   createLoginUrl: (options) => getKeycloakInstance().then(kc => kc.createLoginUrl(options)),
//   createLogoutUrl: (options) => getKeycloakInstance().then(kc => kc.createLogoutUrl(options)),
//   createRegisterUrl: (options) => getKeycloakInstance().then(kc => kc.createRegisterUrl(options)),
//   createAccountUrl: (options) => getKeycloakInstance().then(kc => kc.createAccountUrl(options)),
//   hasRealmRole: (role) => getKeycloakInstance().then(kc => kc.hasRealmRole(role)),
//   hasResourceRole: (role, resource) => getKeycloakInstance().then(kc => kc.hasResourceRole(role, resource)),
//   loadUserProfile: () => getKeycloakInstance().then(kc => kc.loadUserProfile()),
//   loadUserInfo: () => getKeycloakInstance().then(kc => kc.loadUserInfo()),
//   updateToken: (minValidity) => getKeycloakInstance().then(kc => kc.updateToken(minValidity)),
//   clearToken: () => getKeycloakInstance().then(kc => kc.clearToken()),
//   isTokenExpired: (minValidity) => getKeycloakInstance().then(kc => kc.isTokenExpired(minValidity)),
//   hasValidToken: () => getKeycloakInstance().then(kc => kc.tokenParsed !== undefined && !kc.isTokenExpired()),
//   token: null,
//   tokenParsed: null,
//   refreshToken: null,
//   refreshTokenParsed: null,
//   idToken: null,
//   idTokenParsed: null,
//   authenticated: false,
//   subject: null,
//   responseMode: null,
//   flow: null,
//   responseType: null,
//   hasRealmRole: () => false,
//   hasResourceRole: () => false,
//   onReady: (callback) => getKeycloakInstance().then(kc => kc.onReady = callback),
//   onAuthSuccess: null,
//   onAuthError: null,
//   onAuthRefreshSuccess: null,
//   onAuthRefreshError: null,
//   onAuthLogout: null,
//   onTokenExpired: null
// };

// // Initialize the token and other properties when the instance is ready
// getKeycloakInstance().then(kc => {
//   keycloak.token = kc.token;
//   keycloak.tokenParsed = kc.tokenParsed;
//   keycloak.refreshToken = kc.refreshToken;
//   keycloak.refreshTokenParsed = kc.refreshTokenParsed;
//   keycloak.idToken = kc.idToken;
//   keycloak.idTokenParsed = kc.idTokenParsed;
//   keycloak.authenticated = kc.authenticated;
//   keycloak.subject = kc.subject;
//   keycloak.responseMode = kc.responseMode;
//   keycloak.flow = kc.flow;
//   keycloak.responseType = kc.responseType;
//   keycloak.hasRealmRole = kc.hasRealmRole;
//   keycloak.hasResourceRole = kc.hasResourceRole;
  
//   // Set up event listeners
//   kc.onAuthSuccess = () => {
//     keycloak.token = kc.token;
//     keycloak.tokenParsed = kc.tokenParsed;
//     keycloak.refreshToken = kc.refreshToken;
//     keycloak.refreshTokenParsed = kc.refreshTokenParsed;
//     keycloak.idToken = kc.idToken;
//     keycloak.idTokenParsed = kc.idTokenParsed;
//     keycloak.authenticated = kc.authenticated;
//     if (keycloak.onAuthSuccess) keycloak.onAuthSuccess();
//   };
  
//   kc.onAuthLogout = () => {
//     if (keycloak.onAuthLogout) keycloak.onAuthLogout();
//   };
  
//   kc.onTokenExpired = () => {
//     if (keycloak.onTokenExpired) keycloak.onTokenExpired();
//   };
// });

// export default keycloak;


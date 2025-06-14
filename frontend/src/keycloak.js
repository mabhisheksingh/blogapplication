
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  
  url: 'http://localhost:9003',
  realm: 'fusion-master',
  clientId: 'blog-auth-public'
});

export const initOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256'
};

// export const initOptions = {
//   onLoad: 'login-required', // or 'check-sso' if you want silent login
//   checkLoginIframe: false,
// };


export default keycloak;


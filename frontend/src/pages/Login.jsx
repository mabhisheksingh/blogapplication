import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import keycloak from '../keycloak';

const Login = () => {
  useEffect(() => {
    keycloak.login();
  }, []);

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" role="status" />
      <p className="mt-3">Redirecting to Keycloak...</p>
    </Container>
  );
};

export default Login;
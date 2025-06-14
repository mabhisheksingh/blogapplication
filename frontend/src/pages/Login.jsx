import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';

const Login = () => {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (keycloak && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [keycloak]);

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" role="status" />
      <p className="mt-3">Redirecting to Keycloak...</p>
    </Container>
  );
};

export default Login;
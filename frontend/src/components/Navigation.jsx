import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Image, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const Navigation = () => {
  const { keycloak } = useKeycloak();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
    setExpanded(false);
  };

  const handleLogin = () => {
    keycloak.login();
  };

  const closeNav = () => setExpanded(false);

  // Get user's first name from token or email
  const getUserName = () => {
    if (!keycloak.authenticated || !keycloak.tokenParsed) return 'User';
    return keycloak.tokenParsed.given_name || 
           keycloak.tokenParsed.preferred_username?.split('@')[0] || 
           'User';
  };

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <LinkContainer to="/" onClick={closeNav}>
          <Navbar.Brand>Blog App</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/" onClick={closeNav}>
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/posts" onClick={closeNav}>
              <Nav.Link>Posts</Nav.Link>
            </LinkContainer>
            {keycloak.authenticated && (
              <LinkContainer to="/posts/new" onClick={closeNav}>
                <Nav.Link>New Post</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {keycloak.authenticated ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '30px', height: '30px' }}>
                      {getUserName().charAt(0).toUpperCase()}
                    </div>
                    <span>{getUserName()}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
              >
                <LinkContainer to="/profile" onClick={closeNav}>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                variant="outline-light" 
                onClick={handleLogin}
                className="ms-2"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

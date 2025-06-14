import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Image, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const closeNav = () => setExpanded(false);

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
            {isAuthenticated && (
              <LinkContainer to="/posts/new" onClick={closeNav}>
                <Nav.Link>New Post</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    {currentUser?.avatarUrl ? (
                      <Image
                        src={currentUser.avatarUrl}
                        roundedCircle
                        width="32"
                        height="32"
                        className="me-2"
                        alt={currentUser.name}
                      />
                    ) : (
                      <div 
                        className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2"
                        style={{ width: '32px', height: '32px' }}
                      >
                        {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    {currentUser?.name}
                  </div>
                }
                id="user-dropdown"
                align="end"
              >
                <LinkContainer to="/profile" onClick={closeNav}>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/profile/posts" onClick={closeNav}>
                  <NavDropdown.Item>My Posts</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                {currentUser?.roles?.includes('ROLE_ADMIN') && (
                  <LinkContainer to="/admin" onClick={closeNav}>
                    <NavDropdown.Item>Admin Dashboard</NavDropdown.Item>
                  </LinkContainer>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login" onClick={closeNav}>
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register" onClick={closeNav}>
                  <Nav.Link className="btn btn-outline-light btn-sm ms-2">
                    Sign Up
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

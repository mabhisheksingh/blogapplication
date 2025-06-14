import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const Home = () => {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <Container className="text-center bg-light p-5 rounded">
        <h1>Welcome to Blog Application</h1>
        <p className="lead">
          A modern blog platform built with React and Spring Boot
        </p>
        <div className="mt-4">
          <Button as={Link} to="/posts" variant="primary" className="me-3">
            View All Posts
          </Button>
          {keycloak.authenticated && (
            <Button as={Link} to="/posts/new" variant="success">
              Create New Post
            </Button>
          )}
        </div>
      </Container>
      
      <Container className="mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface for writing and managing your blog posts.</p>
          </div>
          <div className="col-md-4 mb-4">
            <h3>Modern Stack</h3>
            <p>Built with React, Spring Boot, and other modern technologies.</p>
          </div>
          <div className="col-md-4 mb-4">
            <h3>Secure Authentication</h3>
            <p>Powered by Keycloak for secure and reliable user authentication.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;

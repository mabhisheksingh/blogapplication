import React from 'react';
import {  Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Container className="text-center bg-light p-5 rounded">
        <h1>Welcome to Blog Application</h1>
        <p>
          A modern blog platform built with React and Spring Boot
        </p>
        <p>
          <Button as={Link} to="/posts" variant="primary" className="me-2">
            View Posts
          </Button>
          <Button as={Link} to="/register" variant="outline-primary">
            Sign Up
          </Button>
        </p>
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
            <h3>Responsive Design</h3>
            <p>Works perfectly on all devices, from mobile to desktop.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;

import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="mt-5">
      <Card className="text-center p-5">
        <Card.Body>
          <h1 className="display-1 text-muted">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="primary" size="lg">
              Go to Home
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFound;

import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI, setupInterceptors } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';

const Posts = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    // Set up API interceptors with keycloak
    const cleanup = setupInterceptors(keycloak);

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make the API call - the interceptor will handle the token
        const response = await postsAPI.getAllPosts();
        setPosts(Array.isArray(response?.data) ? response.data : []);
        
      } catch (err) {
        console.error('Error fetching posts:', err);
        
        if (err.response?.status === 401) {
          // If we get 401, the interceptor should handle token refresh
          // If we still get here, it means refresh failed and we should redirect to login
          keycloak.login();
          return;
        }
        
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Clean up interceptors when component unmounts
    return () => {
      if (cleanup) cleanup();
    };
  }, [initialized, keycloak]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Latest Posts</h1>
        <Button as={Link} to="/posts/new" variant="primary">
          Create New Post
        </Button>
      </div>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={post.imageUrl || 'https://via.placeholder.com/300x200'} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className="text-muted">
                  {post.summary || 'No summary available'}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    By {post.author?.name || 'Unknown'}
                  </small>
                  <Button 
                    as={Link} 
                    to={`/posts/${post.id}`} 
                    variant="outline-primary" 
                    size="sm"
                  >
                    Read More
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Posts;

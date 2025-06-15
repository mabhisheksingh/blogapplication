import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
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

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Latest Posts</h1>
        {keycloak.authenticated && (
          <Button as={Link} to="/posts/new" variant="primary">
            Create New Post
          </Button>
        )}
      </div>
      
      {posts.length === 0 ? (
        <Alert variant="info">No posts found. Be the first to create one!</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {posts.map((post) => (
            <Col key={post.id}>
              <Card className="h-100 shadow-sm">
                {post.imageUrl && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top" 
                      src={post.imageUrl} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </div>
                )}

                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    {post.categories?.map((category, idx) => (
                      <Badge key={idx} bg="info" className="me-1 mb-1">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Card.Title className="h5">{post.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {post.summary || 'No summary available'}
                  </Card.Text>
                  <div className="mb-2">
                    {post.tags?.map((tag, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1 mb-1">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      By {post.authorUsername || 'Unknown'}
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
                <Card.Footer className="text-muted">
                  <small>Posted on {formatDate(post.createdAt)}</small>
                </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      )}

    </Container>
  );
};

export default Posts;

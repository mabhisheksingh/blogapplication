import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApi } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';

const Posts = () => {
  const { keycloak, initialized } = useKeycloak();
  const { postsAPI } = useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    const fetchPosts = async () => {
      if (!keycloak.authenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await postsAPI.getAllPosts();
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [initialized, keycloak.authenticated, postsAPI]);

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

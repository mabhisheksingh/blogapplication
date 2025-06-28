import React, { useState } from 'react';
import { Button, Container, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { postsAPI } from '../services/api';

const Home = () => {
  const { keycloak } = useKeycloak();
  const [search, setSearch] = useState('');
  const [author, setAuthor] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError('');
    setSearchResults([]);
    try {
      const params = {};
      if (search) params.title = search;
      if (author) params.authorUsername = author;
      const res = await postsAPI.getAllPosts(params);
      setSearchResults(res.data);
    } catch (err) {
      setSearchError('Failed to search posts.');
    } finally {
      setSearching(false);
    }
  };

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
          {!keycloak.authenticated && (
            <Button as={Link} to="/register" variant="outline-primary" className="ms-3">
              Register
            </Button>
          )}
        </div>
        {/* Search Bar */}
        <Form className="mt-5" onSubmit={handleSearch}>
          <Row className="justify-content-center align-items-end g-2">
            <Col xs={12} md={5}>
              <Form.Control
                type="text"
                placeholder="Search posts by title or content..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Author username (optional)"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" variant="primary" disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </Col>
          </Row>
        </Form>
        {searchError && <Alert variant="danger" className="mt-3">{searchError}</Alert>}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h4>Search Results</h4>
            <Row className="justify-content-center">
              {searchResults.map(post => (
                <Col md={6} lg={4} className="mb-3" key={post.id}>
                  <Card>
                    {post.imageUrl && (
                      <Card.Img variant="top" src={post.imageUrl} style={{ maxHeight: 200, objectFit: 'cover' }} />
                    )}
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        By {post.authorUsername || 'Unknown'}
                      </Card.Subtitle>
                      <Card.Text style={{ minHeight: 60 }}>
                        {post.summary || post.content?.slice(0, 100) || ''}
                      </Card.Text>
                      <Button as={Link} to={`/posts/${post.id}`} variant="outline-primary" size="sm">
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
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

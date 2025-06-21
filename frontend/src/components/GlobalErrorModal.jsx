import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useError } from '../context/ErrorContext';

export default function GlobalErrorModal() {
  const { error, clearError } = useError();
  return (
    <Modal show={!!error} onHide={clearError} centered>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={clearError}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

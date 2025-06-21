import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, setupInterceptors } from '../services/api';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';
import { useError } from '../context/ErrorContext';

const UserEditModal = ({ show, handleClose, user, onSave }) => {
  const [form, setForm] = useState(user || {});
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton><Modal.Title>Edit User</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={form.username || ''} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Roles</Form.Label>
            <Form.Control value={form.roles ? form.roles.join(', ') : ''} onChange={e => setForm(f => ({ ...f, roles: e.target.value.split(',').map(r => r.trim()) }))} />
            <Form.Text>Comma separated (e.g. USER, ADMIN)</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(form)}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

const UserList = () => {
  const { currentUser } = useAuth();
  const { keycloak, initialized } = useKeycloak();
  const { showError } = useError();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!initialized || !keycloak?.token) return;
    const cleanup = setupInterceptors(keycloak, showError);
    usersAPI.getAllUsers({ headers: { Authorization: `Bearer ${keycloak.token}` } })
      .then(res => {
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { if (cleanup) cleanup(); };
  }, [initialized, keycloak, showError]);

  const handleEdit = user => {
    setEditUser(user);
    setModalShow(true);
  };
  const handleSave = async (user) => {
    await usersAPI.updateUser(user.userId || user.username, user, { headers: { Authorization: `Bearer ${keycloak.token}` } });
    setUsers(users.map(u => (u.userId === user.userId ? user : u)));
    setModalShow(false);
  };

  const handleToggleEnable = async (user) => {
    setActionLoading(al => ({ ...al, [user.userId]: true }));
    try {
      await usersAPI.toggleEnable(user.userId, !user.isEnabled, { headers: { Authorization: `Bearer ${keycloak.token}` } });
      setUsers(users.map(u => u.userId === user.userId ? { ...u, isEnabled: !u.isEnabled } : u));
    } finally {
      setActionLoading(al => ({ ...al, [user.userId]: false }));
    }
  };

  if (!currentUser?.roles?.includes('ADMIN') && !currentUser?.roles?.includes('ROOT')) {
    return <div className="alert alert-danger mt-3">Access Denied</div>;
  }

  if (loading) return <div>Loading users...</div>;
  return (
    <div>
      <h2>User Listing</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Keycloak ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Enabled</th>
            <th>Age</th>
            <th>Profile Image</th>
            <th>Edit</th>
            <th>Enable/Disable</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.keycloakId}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.isEnabled ? 'Yes' : 'No'}</td>
              <td>{user.age ?? ''}</td>
              <td>{user.profileImage ? <img src={user.profileImage} alt="profile" style={{width:32,height:32,borderRadius:'50%'}} /> : ''}</td>
              <td>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(user)} className="me-2">Edit</Button>
              </td>
              <td>
                <Button size="sm" variant={user.isEnabled ? 'danger' : 'success'} disabled={actionLoading[user.userId]} onClick={() => handleToggleEnable(user)}>
                  {actionLoading[user.userId] ? '...' : user.isEnabled ? 'Disable' : 'Enable'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <UserEditModal show={modalShow} handleClose={() => setModalShow(false)} user={editUser} onSave={handleSave} />
    </div>
  );
};

export default UserList;

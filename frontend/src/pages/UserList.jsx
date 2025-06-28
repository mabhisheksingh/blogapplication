import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, setupInterceptors } from '../services/api';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';
import { useError } from '../context/ErrorContext';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const { currentUser } = useAuth();
  const { keycloak, initialized } = useKeycloak();
  const { showError } = useError();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // Special handling for isEmailVerified (convert to number for sorting)
        if (sortConfig.key === 'isEmailVerified') {
          aValue = aValue === true || aValue === 'true' ? 1 : 0;
          bValue = bValue === true || bValue === 'true' ? 1 : 0;
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

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

  const handleToggleEnable = async (user) => {
    setActionLoading(al => ({ ...al, [user.userId]: true }));
    try {
      await usersAPI.toggleEnable(user.userId, !user.isEnabled, { headers: { Authorization: `Bearer ${keycloak.token}` } });
      setUsers(users.map(u => u.userId === user.userId ? { ...u, isEnabled: !u.isEnabled } : u));
    } finally {
      setActionLoading(al => ({ ...al, [user.userId]: false }));
    }
  };

  const handleDelete = async (user) => {
    if(window.confirm(`Are you sure you want to delete user '${user.username}'?`)) {
      setActionLoading(al => ({ ...al, [user.userId]: true }));
      try {
        await usersAPI.deleteUserByUsername(user.username, { headers: { Authorization: `Bearer ${keycloak.token}` } });
        setUsers(users.filter(u => u.userId !== user.userId));
      } catch (err) {
        showError?.('Failed to delete user.');
      } finally {
        setActionLoading(al => ({ ...al, [user.userId]: false }));
      }
    }
  };

  const handleResendVerification = async (user) => {
    setActionLoading(al => ({ ...al, [user.userId]: true }));
    try {
      await usersAPI.resendVerificationEmail(user.username, { headers: { Authorization: `Bearer ${keycloak.token}` } });
      alert('Verification email resent!');
    } catch (err) {
      showError?.('Failed to resend verification email.');
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
      {(currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('ROOT')) && (
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => navigate('/register')}
        >
          Register New User
        </Button>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Keycloak ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th onClick={() => handleSort('role')} style={{cursor: 'pointer'}}>
              Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('isEmailVerified')} style={{cursor: 'pointer'}}>
              Email Verified {sortConfig.key === 'isEmailVerified' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Age</th>
            <th>Profile Image</th>
            <th>Enable/Disable</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.keycloakId}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                {user.isEmailVerified === true || user.isEmailVerified === "true" ? (
                  <Button size="sm" variant="success" disabled style={{cursor: 'default'}}>
                    Verified
                  </Button>
                ) : (
                  <Button size="sm" variant="warning" onClick={() => handleResendVerification(user)} disabled={actionLoading[user.userId]}>
                    Verify Email
                  </Button>
                )}
              </td>
              <td>{user.age ?? ''}</td>
              <td>{user.profileImage ? (
                (() => {
                  let src = user.profileImage;
                  // If already a data URL, use as is
                  if (src.startsWith('data:image/')) return <img src={src} alt="profile" style={{width:32,height:32,borderRadius:'50%'}} />;
                  // Try to decode base64 as a data URL string
                  try {
                    const decoded = atob(src);
                    if (decoded.startsWith('data:image/')) {
                      return <img src={decoded} alt="profile" style={{width:32,height:32,borderRadius:'50%'}} />;
                    }
                  } catch (e) {}
                  // Otherwise treat as raw image data
                  return <img src={`data:image/jpeg;base64,${src}`} alt="profile" style={{width:32,height:32,borderRadius:'50%'}} />;
                })()
              ) : ''}</td>
              <td>
                <Button
                  size="sm"
                  variant={user.isEnabled === true || user.isEnabled === "true" ? 'success':'danger'}
                  disabled={actionLoading[user.userId] || user.username === currentUser.username || user.role === 'ROOT'}
                  onClick={() => handleToggleEnable(user)}
                >
                  {actionLoading[user.userId]
                    ? '...'
                    : user.isEnabled === true || user.isEnabled === "true"
                      ? 'Enable'
                      : 'Disable'}
                </Button>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={user.role === 'ROOT' || user.username === currentUser.username || !(currentUser.roles?.includes('ADMIN') || currentUser.roles?.includes('ROOT'))}
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;

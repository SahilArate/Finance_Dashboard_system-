'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/lib/api';
import Header from '@/components/layout/Header';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAll();
      setUsers(res.data.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await userAPI.updateRole(id, role);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await userAPI.toggleStatus(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: '#7c3aed',
    EDITOR: '#3b82f6',
    ANALYST: '#10b981',
    VIEWER: '#f59e0b',
  };

  const inputStyle = {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#2d2d5e',
    border: '1px solid #3d3d7e',
    borderRadius: '0.375rem',
    color: '#e2e8f0',
    fontSize: '0.75rem',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div>
      <Header title="User Management" />
      <div style={{ padding: '1.5rem' }}>

        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ color: '#e2e8f0', fontWeight: 600 }}>
            All Users ({users.length})
          </h2>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2d2d5e',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              No users found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '1rem',
                      color: '#718096',
                      fontSize: '0.75rem',
                      borderBottom: '1px solid #2d2d5e',
                      backgroundColor: '#16162a',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #2d2d5e' }}>
                    {/* Name */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#7c3aed',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 500 }}>
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                      {user.email}
                    </td>

                    {/* Role */}
                    <td style={{ padding: '1rem' }}>
                      {isAdmin() ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{
                            ...inputStyle,
                            color: roleColors[user.role],
                          }}
                        >
                          <option value="VIEWER">VIEWER</option>
                          <option value="ANALYST">ANALYST</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: roleColors[user.role] + '20',
                          color: roleColors[user.role],
                        }}>
                          {user.role}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: user.isActive ? '#10b98120' : '#ef444420',
                        color: user.isActive ? '#10b981' : '#ef4444',
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem' }}>
                      {isAdmin() && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: user.isActive ? '#f59e0b20' : '#10b98120',
                              color: user.isActive ? '#f59e0b' : '#10b981',
                              border: `1px solid ${user.isActive ? '#f59e0b' : '#10b981'}`,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#ef444420',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({ ...form, role: 'VIEWER' });
      saveAuth(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#111a11',
        border: '1px solid #1a2e1a',
        borderRadius: '1rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#16a34a',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem',
          }}>
            💰
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700 }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            You will be registered as Viewer by default
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#2d1515',
            border: '1px solid #ef4444',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            color: '#ef4444',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="off"
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#1a2e1a',
                border: '1px solid #1f3d1f',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#1a2e1a',
                border: '1px solid #1f3d1f',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#1a2e1a',
                border: '1px solid #1f3d1f',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: loading ? '#15803d' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
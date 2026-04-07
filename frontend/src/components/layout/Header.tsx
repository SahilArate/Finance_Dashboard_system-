'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleColors: Record<string, string> = {
    ADMIN: '#7c3aed',
    EDITOR: '#3b82f6',
    ANALYST: '#10b981',
    VIEWER: '#f59e0b',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{
      height: '64px',
      backgroundColor: '#111118',
      borderBottom: '1px solid #1a2e1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <h1 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
        {title}
      </h1>

      {/* Profile */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: showDropdown ? '#1a2e1a' : 'transparent',
            transition: 'background-color 0.2s',
          }}
        >
          <span style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: roleColors[user?.role || 'VIEWER'] + '20',
            border: `1px solid ${roleColors[user?.role || 'VIEWER']}`,
            borderRadius: '9999px',
            color: roleColors[user?.role || 'VIEWER'],
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            {user?.role}
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#7c3aed',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>▼</span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            backgroundColor: '#1a1a2e',
            border: '1px solid #1a2e1a',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            minWidth: '200px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 100,
          }}>
            {/* User Info */}
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #1a2e1a',
              marginBottom: '0.5rem',
            }}>
              <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
                {user?.name}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {user?.email}
              </p>
              <div style={{
                marginTop: '0.5rem',
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                backgroundColor: roleColors[user?.role || 'VIEWER'] + '20',
                border: `1px solid ${roleColors[user?.role || 'VIEWER']}`,
                borderRadius: '9999px',
                color: roleColors[user?.role || 'VIEWER'],
                fontSize: '0.7rem',
                fontWeight: 600,
              }}>
                {user?.role}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
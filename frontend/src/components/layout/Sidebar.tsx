'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊', roles: ['VIEWER', 'ANALYST', 'EDITOR', 'ADMIN'] },
  { label: 'Records', href: '/dashboard/records', icon: '💳', roles: ['VIEWER', 'ANALYST', 'EDITOR', 'ADMIN'] },
  { label: 'Users', href: '/dashboard/users', icon: '👥', roles: ['ADMIN', 'ANALYST'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNav = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const roleColors: Record<string, string> = {
    ADMIN: '#7c3aed',
    EDITOR: '#3b82f6',
    ANALYST: '#10b981',
    VIEWER: '#f59e0b',
  };

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#111118',
      borderRight: '1px solid #1a2e1a',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        padding: '0 0.5rem',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#7c3aed',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
        }}>
          💰
        </div>
        <div>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1 }}>
            FinanceDash
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '0.2rem' }}>
            Management System
          </p>
        </div>
      </div>

      {/* Nav Label */}
      <p style={{
        color: '#4b5563',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        padding: '0 0.5rem',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
      }}>
        Navigation
      </p>

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                marginBottom: '0.25rem',
                backgroundColor: isActive ? '#7c3aed' : 'transparent',
                color: isActive ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isActive ? 'none' : '1px solid transparent',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>●</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div style={{
        borderTop: '1px solid #1a2e1a',
        paddingTop: '1rem',
        marginTop: '1rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            backgroundColor: '#7c3aed',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name}
            </p>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: roleColors[user?.role || 'VIEWER'],
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.625rem',
            backgroundColor: '#1a1a24',
            border: '1px solid #1a2e1a',
            borderRadius: '0.5rem',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
import { User } from '@/types';

const isBrowser = typeof window !== 'undefined';

export const saveAuth = (token: string, user: User) => {
  if (!isBrowser) return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (!isBrowser) return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeAuth = () => {
  if (!isBrowser) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return !!getToken();
};

export const hasRole = (requiredRoles: string[]): boolean => {
  if (!isBrowser) return false;
  const user = getUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
};
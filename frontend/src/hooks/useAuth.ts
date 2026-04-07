import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUser, removeAuth, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const logout = () => {
    removeAuth();
    router.push('/login');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isEditor = () => user?.role === 'EDITOR' || user?.role === 'ADMIN';
  const isAnalyst = () => user?.role === 'ANALYST' || user?.role === 'EDITOR' || user?.role === 'ADMIN';

  return {
    user,
    loading,
    logout,
    isAdmin,
    isEditor,
    isAnalyst,
    isAuthenticated: isAuthenticated(),
  };
};
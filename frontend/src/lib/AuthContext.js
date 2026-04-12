'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMe, logout as logoutApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {
        if (pathname !== '/login') {
          router.push('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const logout = async () => {
    await logoutApi();
    setUser(null);
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center w-full">
    <div className="text-white text-xl animate-pulse">Loading...</div>
  </div>;

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

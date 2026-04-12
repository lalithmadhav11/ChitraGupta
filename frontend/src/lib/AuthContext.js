'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { logout as logoutApi } from '../lib/api';

const AuthContext = createContext({ user: null, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  const logout = async () => {
    try { await logoutApi(); } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

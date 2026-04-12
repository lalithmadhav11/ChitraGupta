'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) router.replace('/dashboard');
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#1e293b',
        padding: '2.5rem',
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid #334155'
      }}>
        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ChitraGupta
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
          Your AI-powered academic assistant
        </p>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Sign in with your university Google account to get started
        </p>
        
        <a 
          href="http://localhost:5000/api/auth/google"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'white',
            color: '#1e293b',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </a>
      </div>
    </div>
  );
}

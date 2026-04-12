'use client';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = () => {
    window.location.href = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth/google';
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center -m-6 p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-700">
        <h1 className="text-4xl font-bold text-white mb-2">Chitraguptha</h1>
        <p className="text-slate-400 mb-8">Your AI-powered academic assistant</p>
        
        <p className="text-slate-300 text-sm mb-6">
          Sign in with your university Google account to get started
        </p>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white text-slate-800 py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors font-medium"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

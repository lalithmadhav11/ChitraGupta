'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import ClientLayout from '../components/ClientLayout';
import { useState } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

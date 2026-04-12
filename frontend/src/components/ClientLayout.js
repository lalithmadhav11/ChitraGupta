'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === '/login') return null;

  const links = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/emails', label: '📧 Emails' },
    { href: '/assignments', label: '📝 Assignments' },
    { href: '/attendance', label: '📅 Attendance' },
    { href: '/study-plan', label: '🧠 Study Plan' },
  ];

  return (
    <div className="w-64 bg-slate-800 h-screen flex flex-col border-r border-slate-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Chitraguptha</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === link.href 
                ? 'bg-purple-500 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-600"></div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/emails', label: 'Emails', icon: '📧' },
  { href: '/assignments', label: 'Assignments', icon: '📚' },
  { href: '/attendance', label: 'Attendance', icon: '📅' },
  { href: '/study-plan', label: 'Study Plan', icon: '🎯' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-purple-400">ChitraGupta</h1>
        <p className="text-xs text-slate-500 mt-1">Academic Assistant</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all text-left"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Emails', href: '/emails', icon: 'mail' },
    { name: 'Assignments', href: '/assignments', icon: 'assignment' },
    { name: 'Attendance', href: '/attendance', icon: 'calendar_today' },
    { name: 'Study Plan', href: '/study-plan', icon: 'event_note' }
  ];

  return (
    <aside className="w-[260px] h-screen sticky left-0 top-0 bg-surfaceContainerLow flex flex-col py-8 px-4 flex-shrink-0">
      <div className="mb-10 px-4">
        <h1 className="text-xl font-bold tracking-tight text-onSurface flex items-center gap-1 after:content-['\2022'] after:text-primary font-headline">Chitragupta</h1>
        <p className="text-[10px] uppercase tracking-wider text-onSurfaceVariant font-label mt-1">Academic Curator</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 ${isActive ? 'text-primary font-bold border-r-2 border-primary' : 'text-onSurfaceVariant hover:bg-surfaceContainerHigh'}`}>
              <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-6">
        <button className="w-full py-3 px-4 rounded-xl btn-gradient text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
          New Research
        </button>

        <div className="pt-6 space-y-2 border-t border-outlineVariant/10">
          <button onClick={logout} className="w-full flex items-center gap-3 py-2 text-onSurfaceVariant font-medium hover:bg-surfaceContainerHigh transition-colors duration-200 rounded-lg px-2">
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

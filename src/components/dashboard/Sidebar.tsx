'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard, Home, FileText, Users, PlusCircle, Settings, LogOut, X, Tag, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/services/types';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  TENANT: [
    { label: 'Overview', href: '/dashboard/tenant', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Requests', href: '/dashboard/tenant/requests', icon: <FileText className="w-4 h-4" /> },
    { label: 'Browse Properties', href: '/properties', icon: <Home className="w-4 h-4" /> },
  ],
  LANDLORD: [
    { label: 'Overview', href: '/dashboard/landlord', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Properties', href: '/dashboard/landlord/properties', icon: <Home className="w-4 h-4" /> },
    { label: 'Add Property', href: '/dashboard/landlord/properties/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Requests', href: '/dashboard/landlord/requests', icon: <FileText className="w-4 h-4" /> },
  ],
  ADMIN: [
    { label: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users', href: '/dashboard/admin', icon: <Users className="w-4 h-4" /> },
    { label: 'Categories', href: '/dashboard/admin/categories', icon: <Tag className="w-4 h-4" /> },
  ],
};

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => { onClose?.(); }, [pathname]);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!user) return null;
  const nav = ROLE_NAV[user.role] ?? [];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const SidebarBody = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/" className="text-lg font-extrabold text-slate-900 dark:text-white dark:text-white">
          Your<span className="text-indigo-600 dark:text-indigo-400">Rent</span>
        </Link>
        {onClose && <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700 dark:text-white dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>}
      </div>

      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-600 dark:text-white">{user.role}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white dark:text-white truncate">{user.name || user.email}</p>
        <p className="text-xs text-slate-600 dark:text-white dark:text-slate-400 truncate">{user.email}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={`${item.href}-${item.label}`} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}<span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <User className="w-4 h-4" /><span>My Profile</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <Settings className="w-4 h-4" /><span>Back to Site</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition cursor-pointer">
          <LogOut className="w-4 h-4" /><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen">{SidebarBody}</aside>
      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={onClose} className={`absolute inset-0 bg-slate-900/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 h-full w-72 max-w-[80vw] shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>{SidebarBody}</div>
      </div>
    </>
  );
}

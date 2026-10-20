'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle'; // ইমপোর্ট নিশ্চিত করুন

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardPath = user?.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const displayName = user?.name || user?.email || 'My Account';
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMobile}
          className="text-xl font-extrabold text-slate-900 dark:text-white dark:text-white tracking-tight flex items-center gap-2"
        >
          <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-sm">YR</span>
          YourRent
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-white dark:text-slate-300">
          {[
            { href: '/properties', label: 'Properties' },
            { href: '/how-it-works', label: 'How it Works' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={dashboardPath}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-white dark:text-slate-200 max-w-[100px] truncate hidden lg:inline">
                  {displayName}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white dark:text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-600 dark:text-white dark:text-slate-400 truncate">{user?.email}</p>
                    {user?.role && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <div className="p-1">
                    <Link href={dashboardPath} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </div>
                  <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => { setDropdownOpen(false); logout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition cursor-pointer">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-slate-700 dark:text-white dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                Sign In
              </Link>
              <Link href="/register" className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-xs">
                Register
              </Link>
            </div>
          )}
          
          <ThemeToggle /> {/* টগল বাটন এখানে */}

          <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden p-2 text-slate-700 dark:text-white dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white cursor-pointer" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রয়ার */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-900 px-4 py-4 space-y-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/properties', label: 'Properties' },
            { href: '/how-it-works', label: 'How it Works' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMobile} className="block px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href={dashboardPath} onClick={closeMobile} className="block px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Dashboard</Link>
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <p className="px-3 py-1 text-xs text-slate-400 dark:text-slate-600 dark:text-white truncate">{displayName}</p>
                <button onClick={() => { closeMobile(); logout(); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl cursor-pointer">Logout</button>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link href="/login" onClick={closeMobile} className="block px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Sign In</Link>
              <Link href="/register" onClick={closeMobile} className="block px-3 py-2.5 text-sm font-medium text-center bg-slate-900 dark:bg-indigo-600 text-white rounded-xl">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

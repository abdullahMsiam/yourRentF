'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  const getDashboardPath = () => {
    if (!user?.role) return '/dashboard';
    return `/dashboard/${user.role.toLowerCase()}`;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-sm">YR</span>
          YourRent
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link href="/properties" className="hover:text-indigo-600 transition">
            Properties
          </Link>
          {isAuthenticated && (
            <Link href={getDashboardPath()} className="hover:text-indigo-600 transition">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardPath()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                {user?.role || 'My Account'}
              </Link>
              <button
                onClick={logout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-slate-700 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
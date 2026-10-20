'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/services/types';

// Demo credentials — used by one-click demo buttons
const DEMO_USERS: Record<UserRole, { email: string; password: string; label: string }> = {
  TENANT: {
    email: process.env.NEXT_PUBLIC_DEMO_TENANT_EMAIL ?? '',
    password: process.env.NEXT_PUBLIC_DEMO_TENANT_PASSWORD ?? '',
    label: 'Tenant',
  },
  LANDLORD: {
    email: process.env.NEXT_PUBLIC_DEMO_LANDLORD_EMAIL ?? '',
    password: process.env.NEXT_PUBLIC_DEMO_LANDLORD_PASSWORD ?? '',
    label: 'Landlord',
  },
  ADMIN: {
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? '',
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? '',
    label: 'Admin',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);
  const [error, setError] = useState('');

  const doLogin = async (email: string, password: string) => {
    const { accessToken, user } = await authService.login(email, password);
    login(accessToken, user);
    const rolePath = user.role.toLowerCase();
    router.push(`/dashboard/${rolePath}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await doLogin(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setDemoLoading(role);
    setError('');
    try {
      const { email, password } = DEMO_USERS[role];
      await doLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to login as ${role}`);
    } finally {
      setDemoLoading(null);
    }
  };

  const isBusy = loading || demoLoading !== null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left showcase panel */}
      <div className="bg-slate-900 text-white p-12 hidden lg:flex flex-col justify-between">
        <h1 className="text-3xl font-bold">YourRent</h1>
        <div>
          <h2 className="text-4xl font-extrabold mb-4">Welcome back to YourRent.</h2>
          <p className="text-slate-400">
            Manage rentals, access lease agreements, and pay bills easily.
          </p>
        </div>
        <p className="text-xs text-slate-500">© 2026 YourRent Platform Inc.</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xs border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
          <p className="text-slate-500 text-sm mb-6">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={isBusy}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo role quick-login */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Or try demo
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DEMO_USERS) as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  disabled={isBusy}
                  className="px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {demoLoading === role ? '...' : DEMO_USERS[role].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              For demo purposes only
            </p>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
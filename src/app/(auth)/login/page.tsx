'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = response.data || response;
      const token = data.accessToken || data.token || response.accessToken || response.token;
      const user = data.user || response.user;

      if (!token || !user) {
        throw new Error('Invalid response structure from backend. Missing token or user.');
      }

      // ⚡ THIS UPDATES THE AUTH CONTEXT & NAVBAR INSTANTLY
      login(token, user);

      // Redirect to dashboard
      const rolePath = (user.role || 'tenant').toLowerCase();
      router.push(`/dashboard/${rolePath}`);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="bg-slate-900 text-white p-12 hidden lg:flex flex-col justify-between">
        <h1 className="text-3xl font-bold">YourRent</h1>
        <div>
          <h2 className="text-4xl font-extrabold mb-4">Welcome back to YourRent.</h2>
          <p className="text-slate-400">Manage rentals, access lease agreements, and pay bills easily.</p>
        </div>
        <p className="text-xs text-slate-500">© 2026 YourRent Platform Inc.</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xs border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
          <p className="text-slate-500 text-sm mb-6">Enter your credentials to access your account.</p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
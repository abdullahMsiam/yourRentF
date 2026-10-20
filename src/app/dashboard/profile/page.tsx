'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Home,
  FileText,
  Settings,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import type { User } from '@/services/types';

export default function ProfilePage() {
  const { user: ctxUser } = useAuth();
  const [user, setUser] = useState<User | null>(ctxUser);
  const [loading, setLoading] = useState(!ctxUser);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ctxUser) {
      setUser(ctxUser);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await authService.me();
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ctxUser]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load profile</p>
            <p className="text-sm mt-1">{error || 'User data unavailable.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardPath = user.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const initials = (user.name || user.email)
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isActive = user.status === 'ACTIVE' || !user.status;

  // Format stats — what a user "owns" on the platform
  const activityStats = [
    {
      label: user.role === 'LANDLORD' ? 'Listed Properties' : 'My Requests',
      value: '—',
      icon: user.role === 'LANDLORD' ? <Home className="w-5 h-5" /> : <FileText className="w-5 h-5" />,
      accent: 'indigo',
    },
    {
      label: 'Account Status',
      value: isActive ? 'Active' : 'Blocked',
      icon: isActive ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />,
      accent: isActive ? 'emerald' : 'rose',
    },
    {
      label: 'Member Since',
      value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
      icon: <Calendar className="w-5 h-5" />,
      accent: 'default',
    },
  ];

  const accentClass = {
    default: 'text-slate-400',
    indigo: 'text-indigo-500',
    emerald: 'text-emerald-500',
    rose: 'text-rose-500',
  };

  const accountFields = [
    { icon: <UserIcon className="w-4 h-4" />, label: 'Full Name', value: user.name || '—' },
    { icon: <Mail className="w-4 h-4" />, label: 'Email Address', value: user.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone Number', value: user.phoneNumber || 'Not provided' },
    { icon: <Shield className="w-4 h-4" />, label: 'Account Role', value: user.role },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your account information and activity.
          </p>
        </div>
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Hero profile card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {user.name || 'Unnamed User'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isActive
                    ? 'bg-emerald-400/20 border-emerald-300/40 text-emerald-100'
                    : 'bg-rose-400/20 border-rose-300/40 text-rose-100'
                }`}
              >
                {isActive ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {user.status || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activityStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs font-bold uppercase tracking-wider ${accentClass[stat.accent as keyof typeof accentClass]}`}>
                {stat.label}
              </p>
              <span className={accentClass[stat.accent as keyof typeof accentClass]}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Account details + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main — account details */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              Account details
            </h3>
          </div>
          <dl className="divide-y divide-slate-100">
            {accountFields.map((f) => (
              <div
                key={f.label}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <dt className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                  {f.icon}
                  {f.label}
                </dt>
                <dd className="text-sm font-semibold text-slate-900 text-right break-all">
                  {f.value}
                </dd>
              </div>
            ))}
            {user.createdAt && (
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                  <Calendar className="w-4 h-4" />
                  Member since
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Sidebar — quick actions + notice */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick actions
            </h3>
            <div className="space-y-1.5">
              <Link
                href={dashboardPath}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                <Home className="w-4 h-4 text-slate-400" />
                My Dashboard
              </Link>
              {user.role === 'TENANT' && (
                <Link
                  href="/properties"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  Browse Properties
                </Link>
              )}
              {user.role === 'LANDLORD' && (
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <Home className="w-4 h-4 text-slate-400" />
                  Add Property
                </Link>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
            </div>
          </div>

          {/* Activity card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Recent activity
            </h3>
            <p className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-200 rounded-xl">
              Activity feed coming soon
            </p>
          </div>

          {/* Read-only notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Profile editing soon
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Editing name, phone, and password will be available once
                backend support is added. Contact{' '}
                <a
                  href="mailto:support@yourrent.app"
                  className="text-indigo-600 hover:underline"
                >
                  support@yourrent.app
                </a>{' '}
                for urgent changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

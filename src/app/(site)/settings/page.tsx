'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Moon,
  Lock,
  Palette,
  Shield,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [notifs, setNotifs] = useState({
    email: true,
    rentalUpdates: true,
    marketing: false,
  });

  const dashboardPath = user?.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const handleSave = () => {
    // Local only for now
    showToast('Preferences saved locally', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your preferences and account security.
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          Appearance
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Choose how YourRent looks to you.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'light', label: 'Light', icon: <Moon className="w-4 h-4" /> },
            { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
            { value: 'system', label: 'System', icon: <Palette className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                theme === t.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Dark mode styling is being rolled out across the app.
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          Notifications
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Choose what we email you about.
        </p>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Account & security emails', desc: 'Login alerts, password changes' },
            { key: 'rentalUpdates', label: 'Rental updates', desc: 'New requests, approvals, and payments' },
            { key: 'marketing', label: 'Marketing emails', desc: 'New features, tips, and offers' },
          ].map((n) => (
            <div key={n.key} className="flex items-start justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifs({ ...notifs, [n.key]: !notifs[n.key as keyof typeof notifs] })
                }
                className={`relative w-11 h-6 rounded-full transition shrink-0 cursor-pointer ${
                  notifs[n.key as keyof typeof notifs] ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifs[n.key as keyof typeof notifs] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Save Preferences
        </button>
      </div>

      {/* Security */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          Security
        </h2>
        <div className="space-y-3 mt-3">
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Change password</p>
              <p className="text-xs text-slate-500">Update your account password</p>
            </div>
            <button
              onClick={() => showToast('Password change requires backend endpoint', 'error')}
              className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Update
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Two-factor auth</p>
              <p className="text-xs text-slate-500">Add extra security to your account</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Coming soon
            </span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-rose-200 rounded-2xl p-6">
        <h2 className="font-bold text-rose-700 mb-1 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger zone
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => showToast('Account deletion requires backend endpoint', 'error')}
          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

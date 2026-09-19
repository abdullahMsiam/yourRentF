
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md space-y-6">
        <h1 className="text-8xl font-black text-indigo-600">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
          <p className="text-slate-500 text-sm">
            Sorry, the page you are looking for doesn't exist, was removed, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
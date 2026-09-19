
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Something Went Wrong</h2>
          <p className="text-slate-500 text-sm">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
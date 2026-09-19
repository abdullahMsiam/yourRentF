'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Ref prevents React 18 Strict Mode from calling the confirm API twice
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Invalid session details.');
      return;
    }

    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmPayment = async () => {
      try {
        await fetchApi('/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        });

        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Verification failed.');
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Verifying Payment...</h2>
            <p className="text-sm text-slate-500">Please wait while we confirm your transaction with Stripe.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
            <p className="text-sm text-slate-500">
              Your rental application status has been updated to <span className="font-semibold text-slate-800">COMPLETED</span>.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✕
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Payment Verification Failed</h2>
            <p className="text-sm text-slate-500">{errorMessage}</p>
            <div className="pt-2 flex gap-3">
              <Link
                href="/dashboard"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
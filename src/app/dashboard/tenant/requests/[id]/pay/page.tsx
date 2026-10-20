'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/context/ToastContext';

export default function InitiatePaymentPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { paymentUrl } = await paymentService.create(id);
      window.location.href = paymentUrl;

      if (!paymentUrl) {
        throw new Error('Payment URL not received from backend.');
      }
      window.location.href = paymentUrl;
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Payment initiation failed',
        'error'
      );
      setLoading(false);
    }
  };

  return (
    // আপনার JSX অপরিবর্তিত
    <div className="max-w-md mx-auto py-16 px-6 text-center space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
        <p className="text-slate-500 text-sm">
          You are paying for Rental Application ID: <br />
          <span className="font-mono text-xs text-indigo-600">{id}</span>
        </p>
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer disabled:opacity-60"
        >
          {loading ? 'Redirecting Gateway...' : 'Proceed to Payment Gateway'}
        </button>
      </div>
    </div>
  );
}
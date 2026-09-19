'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function InitiatePaymentPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/payments/create', {
        method: 'POST',
        body: JSON.stringify({ rentalRequestId: id }),
      });

      const paymentUrl =
        res?.paymentUrl ||
        res?.data?.paymentUrl ||
        res?.url ||
        res?.data?.url ||
        res?.GatewayPageURL ||
        res?.data?.GatewayPageURL;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Payment URL not received from backend.');
      }
    } catch (err: any) {
      showToast(err.message || 'Payment initiation failed', 'error');
      setLoading(false);
    }
  };

  return (
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
        >
          {loading ? 'Redirecting Gateway...' : 'Proceed to Payment Gateway'}
        </button>
      </div>
    </div>
  );
}
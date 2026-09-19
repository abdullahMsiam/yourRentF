import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Payment Cancelled</h2>
        <p className="text-slate-500 text-sm">
          The transaction was not completed. You can try paying again from your dashboard.
        </p>
        <Link
          href="/dashboard/tenant"
          className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
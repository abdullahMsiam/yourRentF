import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileCheck, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Trust & Safety | YourRent',
  description: 'Learn how YourRent keeps renters and landlords safe.',
};

export default function TrustPage() {
  const pillars = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Verified Listings',
      desc: 'Landlords must provide accurate information before a property goes live. Fake or duplicate listings are removed quickly.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Secure Payments',
      desc: 'We never store your credit card data. All transactions are securely processed by Stripe, a PCI-DSS Level 1 provider.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Account Protection',
      desc: 'Your password is hashed with bcrypt. We use HTTP-only cookies and JWT to prevent unauthorized access.',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Fair Agreements',
      desc: 'We encourage clear communication and digital records between tenants and landlords to avoid future disputes.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900">Trust & Safety</h1>
        <p className="text-lg text-slate-600 mt-4">
          We are committed to making YourRent a safe, transparent, and reliable platform for both tenants and landlords.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {pillars.map((p) => (
          <div key={p.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              {p.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900">Report a problem</h3>
            <p className="text-sm text-slate-600 mt-1">
              Spotted a suspicious listing or suspicious user behavior? Let us know immediately.
            </p>
          </div>
        </div>
        <Link href="/contact" className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap">
          Contact Support
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Search, FileCheck, CreditCard, Key, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'How it Works | YourRent',
  description: 'Learn how renting works on YourRent — from search to move-in.',
};

export default function HowItWorksPage() {
  const tenantSteps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Search & filter',
      desc: 'Browse verified listings, filter by city, price, and property type.',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Send request',
      desc: 'Submit a rental application with your move-in date and lease duration.',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Pay securely',
      desc: 'Once approved, pay via Stripe — safe, fast, and fully documented.',
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Move in',
      desc: 'Get confirmation and move-in instructions from your new landlord.',
    },
  ];

  const landlordSteps = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'List property',
      desc: 'Add photos, pricing, amenities, and availability in under 2 minutes.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Review applications',
      desc: 'See incoming rental requests with tenant details and approve or reject.',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Receive payment',
      desc: 'Collect rent digitally — with automatic receipts and records.',
    },
  ];

  return (
    <div className="pb-16">
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            How it works
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            A simple, transparent path from listing to move-in — for both tenants
            and landlords.
          </p>
        </div>
      </section>

      {/* Tenants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            For tenants
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            Find & rent in 4 steps
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tenantSteps.map((step, i) => (
            <div
              key={step.title}
              className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                {i + 1}
              </div>
              <div className="text-indigo-600 mb-3">{step.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Landlords */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              For landlords
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              List & earn in 3 steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landlordSteps.map((step, i) => (
              <div
                key={step.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <div className="text-emerald-600 mb-3">{step.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">
          Common questions
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Is YourRent free for tenants?', a: 'Yes — searching and applying is completely free. You only pay rent when a landlord approves your request.' },
            { q: 'How do payments work?', a: 'Payments are processed through Stripe. Once your landlord approves the application, you will be redirected to a secure checkout.' },
            { q: 'Can I cancel a rental request?', a: 'Yes — you can withdraw an application from your tenant dashboard before the landlord approves it.' },
            { q: 'How are listings verified?', a: 'Every landlord account is verified and each property is reviewed before going live.' },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group bg-white border border-slate-200 rounded-2xl p-5"
            >
              <summary className="cursor-pointer font-semibold text-slate-900 flex justify-between items-center">
                {faq.q}
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 text-center pb-16">
        <Link
          href="/properties"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Get Started →
        </Link>
      </section>
    </div>
  );
}

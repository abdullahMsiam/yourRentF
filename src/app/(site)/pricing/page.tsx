import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Pricing | YourRent',
  description: 'Simple, transparent pricing for landlords. Free for tenants.',
};

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/forever',
    description: 'Perfect for trying out the platform.',
    features: [
      '1 active property listing',
      'Basic property analytics',
      'Standard support',
      'Email notifications',
    ],
    cta: 'Start Free',
    ctaHref: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$19',
    period: '/month',
    description: 'For serious landlords managing multiple properties.',
    features: [
      'Up to 20 property listings',
      'Advanced analytics & insights',
      'Priority email support',
      'Featured listings placement',
      'Tenant screening reports',
    ],
    cta: 'Start 14-day Trial',
    ctaHref: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For property management companies and agencies.',
    features: [
      'Unlimited listings',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Simple pricing for every landlord
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Free for tenants, always. Landlords pick the plan that fits — from
            casual listings to enterprise portfolios.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-indigo-500'
                  : 'bg-white dark:bg-slate-900 border border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Popular
                </span>
              )}
              <h3
                className={`text-lg font-bold ${
                  plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  plan.highlighted ? 'text-slate-400' : 'text-slate-600 dark:text-white'
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-black ${
                    plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? 'text-slate-400' : 'text-slate-600 dark:text-white'
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? 'text-indigo-400' : 'text-emerald-600'
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? 'text-slate-300' : 'text-slate-600 dark:text-white'
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`mt-8 block text-center py-3 rounded-xl font-semibold text-sm transition ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
          Pricing questions
        </h2>
        <div className="space-y-3">
          {[
            { q: 'Is YourRent really free for tenants?', a: 'Yes, 100% free. Tenants never pay to browse, apply, or manage rentals on YourRent.' },
            { q: 'Can I cancel anytime?', a: 'Yes — cancel your subscription from your dashboard anytime. No lock-in contracts.' },
            { q: 'What payment methods do you accept?', a: 'All major credit cards via Stripe. Enterprise customers can request invoicing.' },
            { q: 'Do you offer discounts for annual billing?', a: 'Yes — 2 months free when you pay annually. Contact us for details.' },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group bg-white dark:bg-slate-900 border border-slate-200 rounded-2xl p-5"
            >
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white flex justify-between items-center gap-3">
                {faq.q}
                <span className="text-slate-400 group-open:rotate-180 transition shrink-0">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-white">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

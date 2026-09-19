import { ShieldCheck, Zap, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    title: 'Verified Property Listings',
    desc: 'Every property is pre-reviewed to prevent fraudulent listings or fake pricing.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Application Review',
    desc: 'Direct communication with owners speeds up approval from days to hours.',
    icon: Zap,
  },
  {
    title: 'Encrypted Digital Payments',
    desc: 'Pay rent securely with integrated Stripe card checkout and instant digital receipts.',
    icon: CreditCard,
  },
  {
    title: 'Dedicated Tenant Support',
    desc: 'Our customer support team is available to assist you throughout your tenancy.',
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold">Why Choose YourRent?</h2>
          <p className="text-slate-400 text-sm">
            Built to provide a safer, faster, and more convenient rental experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { ShieldCheck, Zap, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    title: 'Verified Listings',
    desc: 'Every property is pre-reviewed to prevent fraudulent listings or fake pricing.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Review',
    desc: 'Direct communication with owners speeds up approval from days to hours.',
    icon: Zap,
  },
  {
    title: 'Secure Payments',
    desc: 'Pay rent securely with integrated Stripe card checkout and instant digital receipts.',
    icon: CreditCard,
  },
  {
    title: '24/7 Support',
    desc: 'Our customer support team is available to assist you throughout your tenancy.',
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-900 dark:bg-black text-white transition-colors relative overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Why YourRent</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for peace of mind</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            We`ve engineered every step of the rental process to be faster, safer, and more transparent.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title} 
                className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-700/50 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Search, FileCheck, KeyRound } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Discover & Filter',
    desc: 'Browse verified listings across top locations using customized search filters.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Apply Online',
    desc: 'Send rental applications directly to property owners with transparent lease terms.',
    icon: FileCheck,
  },
  {
    step: '03',
    title: 'Secure & Move-In',
    desc: 'Complete digital payments safely through Stripe and receive instant confirmation.',
    icon: KeyRound,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">How YourRent Works</h2>
          <p className="text-slate-500 text-sm">
            Renting a home or listing your space is seamless, transparent, and completely digital.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative space-y-4 hover:shadow-md transition"
              >
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Step {item.step}
                </span>
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
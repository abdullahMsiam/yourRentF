import { Search, FileCheck, KeyRound, Home, Users, CreditCard } from 'lucide-react';

const tenantSteps = [
  { step: '01', title: 'Discover', desc: 'Browse and filter verified listings.', icon: Search },
  { step: '02', title: 'Apply', desc: 'Send a digital rental request.', icon: FileCheck },
  { step: '03', title: 'Move-In', desc: 'Pay securely and get the keys.', icon: KeyRound },
];

const landlordSteps = [
  { step: '04', title: 'List Property', desc: 'Add details, photos, and pricing.', icon: Home },
  { step: '05', title: 'Review', desc: 'Screen tenant applications easily.', icon: Users },
  { step: '06', title: 'Get Paid', desc: 'Receive rent directly to your account.', icon: CreditCard },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-100/60 dark:bg-slate-950/50 transition-colors relative border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">The Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">
            How YourRent Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto transition-colors">
            A seamless digital journey for both tenants and property owners. No paperwork, no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Tenant Steps */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> For Tenants
            </h3>
            <div className="space-y-6">
              {tenantSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-5 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-500/40 dark:text-indigo-400/40">0{item.step}</span>
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Landlord Steps */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> For Landlords
            </h3>
            <div className="space-y-6">
              {landlordSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-5 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-500/40 dark:text-emerald-400/40">0{item.step}</span>
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
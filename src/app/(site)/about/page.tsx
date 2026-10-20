import Link from 'next/link';
import { Home, Users, Shield, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About Us | YourRent',
  description: 'Learn about YourRent — a modern rental platform connecting tenants with trusted landlords.',
};

export default function AboutPage() {
  const values = [
    {
      icon: <Home className="w-6 h-6" />,
      title: 'Quality listings',
      desc: 'Every property is reviewed before going live, so you never waste time on fake ads.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Direct connections',
      desc: 'Chat, negotiate, and confirm rentals directly with landlords — no middlemen.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure payments',
      desc: 'Stripe-powered payments with escrow support keep both sides protected.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Modern experience',
      desc: 'A clean, fast, and accessible interface designed for renters and landlords alike.',
    },
  ];

  const team = [
    { name: 'Abdullah Siam', role: 'Founder & Full-Stack Developer', avatar: 'AS' },
    { name: 'Jordan Lee', role: 'Head of Product', avatar: 'JL' },
    { name: 'Maria Garcia', role: 'Lead Designer', avatar: 'MG' },
    { name: 'Kenji Tanaka', role: 'Customer Success', avatar: 'KT' },
  ];

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Renting, reimagined.
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            We&apos;re building the easiest way to find, rent, and manage homes — for
            both tenants and landlords.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Our mission
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Make housing honest and easy.
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Traditional rental platforms are full of fake listings, hidden fees,
            and endless paperwork. YourRent fixes that with verified properties,
            transparent pricing, and digital-first processes.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Our team
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Built by people who care
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md transition"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Ready to find your next home?
        </h2>
        <p className="text-slate-600">
          Join thousands of happy renters and landlords on YourRent.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/properties"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Browse Properties
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-slate-50 text-slate-900 font-semibold px-6 py-3 rounded-xl border border-slate-200 transition"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}

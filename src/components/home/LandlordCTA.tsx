import Link from 'next/link';

export default function LandlordCTA() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 px-3 py-1 rounded-full border border-indigo-400/30">
            For Property Owners
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Have a property to rent? List it today!
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Connect directly with verified tenants, manage rental requests, and receive rent online effortlessly.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/dashboard/properties/new"
            className="bg-white hover:bg-slate-100 text-indigo-700 font-bold px-8 py-4 rounded-xl transition shadow-md block text-center"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';

export default function LandlordCTA() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-10 md:p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
        {/* Abstract background pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative space-y-6 max-w-xl text-center lg:text-left z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            For Property Owners
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.15]">
            Turn your empty space into <span className="text-indigo-200">monthly income.</span>
          </h2>
          <p className="text-indigo-100/90 text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
            Join thousands of landlords who use YourRent to list properties, screen tenants, and receive rent — all completely digital.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/dashboard/landlord/properties/new"
            className="bg-white hover:bg-slate-50 text-indigo-700 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
          >
            List Your Property
          </Link>
          <Link
            href="/how-it-works"
            className="bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl border border-white/30 transition-all text-center"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}

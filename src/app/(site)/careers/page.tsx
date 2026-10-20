import Link from 'next/link';
import { Briefcase, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Careers | YourRent',
  description: 'Join our team and help reimagine renting.',
};

const ROLES = [
  {
    title: 'Senior Frontend Engineer',
    dept: 'Engineering',
    location: 'Remote (GMT+6 ± 3)',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    dept: 'Design',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Lead',
    dept: 'Operations',
    location: 'Remote',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Build the future of renting
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We&apos;re a small, remote-first team reimagining how people find and
            rent homes.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Open positions</h2>
          <div className="space-y-3">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{role.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {role.dept}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {role.location}
                    </span>
                    <span>{role.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-indigo-600 hover:underline whitespace-nowrap"
                >
                  Apply →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-2">
            Don&apos;t see your role?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            We&apos;re always interested in meeting talented people. Send us your
            resume and tell us what you&apos;d love to work on.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

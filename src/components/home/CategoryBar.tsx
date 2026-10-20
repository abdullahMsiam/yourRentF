'use client';

import { Building2, Home, Hotel, Store, Briefcase, Sparkles } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { label: 'Apartments', icon: Building2, type: 'apartment' },
  { label: 'Family Homes', icon: Home, type: 'family-home' },
  { label: 'Studios', icon: Hotel, type: 'studio' },
  { label: 'Commercial', icon: Store, type: 'commercial' },
  { label: 'Luxury Villas', icon: Sparkles, type: 'luxury' },
  { label: 'Offices', icon: Briefcase, type: 'office' },
];

export default function CategoryBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-10">
      {/* Outer wrapper with subtle tint */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-300/50 dark:shadow-black/60 border border-slate-200/80 dark:border-slate-700/80 p-3 sm:p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 transition-colors">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={`/properties?type=${item.type}`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30 hover:border-indigo-100 dark:hover:border-indigo-800/50 transition-all group"
            >
              <div className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200/60 dark:border-slate-700/60 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
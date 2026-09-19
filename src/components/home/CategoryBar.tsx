'use client';

import { Building2, Home, Hotel, Store, Briefcase, Sparkles } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { label: 'Apartments', icon: Building2, type: 'apartment' },
  { label: 'Family Homes', icon: Home, type: 'family-home' },
  { label: 'Studios', icon: Hotel, type: 'studio' },
  { label: 'Commercial', icon: Store, type: 'commercial' },
  { label: 'Luxury', icon: Sparkles, type: 'luxury' },
];

export default function CategoryBar() {
  return (
    <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={`/properties?type=${item.type}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50/70 transition border border-transparent hover:border-indigo-100 group"
            >
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
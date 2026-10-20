'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyService } from '@/services/propertyService';
import TestimonialsAndFAQ from '@/components/home/TestimonialsAndFAQ';
import LandlordCTA from '@/components/home/LandlordCTA';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PopularLocations from '@/components/home/PopularLocations';
import HowItWorks from '@/components/home/HowItWorks';
import CategoryBar from '@/components/home/CategoryBar';
import PropertyCard from '@/components/properties/PropertyCard'; // PropertyCard ইমপোর্ট
import type { PropertyListItem } from '@/services/types';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const list = await propertyService.list({ limit: 6 });
        setFeaturedProperties(list.slice(0, 6));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load featured properties at this time.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProperties();
  }, []);

  return (
    <div className="space-y-16 pb-16 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Trusted by 10,000+ renters
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Find a home that<br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  fits your life.
                </span>
              </h1>

              <p className="text-slate-300 text-lg max-w-lg">
                Browse verified rental listings, connect directly with landlords, and
                handle payments — all in one place.
              </p>

              <form action="/properties" method="GET" className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-xl">
                <input
                  type="text"
                  name="city"
                  placeholder="City or area..."
                  className="flex-1 px-4 py-3 rounded-xl text-slate-900 dark:text-white bg-transparent dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                />
                <select
                  name="type"
                  className="px-4 py-3 rounded-xl text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="">Any type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                </select>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap text-sm cursor-pointer">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">5,200+</span> Properties listed
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">3,800+</span> Happy tenants
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">4.9★</span> Average rating
                </div>
              </div>
            </div>

            {/* Right Image Collage */}
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 transform rotate-3 hover:rotate-0 transition duration-500">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" alt="Modern house" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 transform -rotate-3 hover:rotate-0 transition duration-500">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="Luxury apartment" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Villa" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Featured Listings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
              Explore top rentals available right now.
            </p>
          </div>
          <Link href="/properties" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline hidden sm:inline-block">
            View all →
          </Link>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 h-72 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No featured properties available at the moment.
          </div>
        ) : (
          /* এখানে আমরা PropertyCard ব্যবহার করছি */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/properties" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
            View all properties →
          </Link>
        </div>
      </section>

      {/* বাকি কম্পোনেন্টগুলো */}
      <CategoryBar />
      <HowItWorks />
      <PopularLocations />
      <WhyChooseUs />
      <LandlordCTA />
      <TestimonialsAndFAQ />
    </div>
  );
}
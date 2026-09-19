'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import TestimonialsAndFAQ from '@/components/home/TestimonialsAndFAQ';
import LandlordCTA from '@/components/home/LandlordCTA';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PopularLocations from '@/components/home/PopularLocations';
import HowItWorks from '@/components/home/HowItWorks';
import CategoryBar from '@/components/home/CategoryBar';

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  address: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
}

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch properties for the home page showcase
        const response = await fetchApi<any>('/properties?limit=6');

        // Safe Data Extraction (Handles arrays, { data: [...] }, or { properties: [...] })
        let propertyList: Property[] = [];
        if (Array.isArray(response)) {
          propertyList = response;
        } else if (response && Array.isArray(response.data)) {
          propertyList = response.data;
        } else if (response && Array.isArray(response.properties)) {
          propertyList = response.properties;
        }

        // Showcase top 6 featured properties on the home page
        setFeaturedProperties(propertyList.slice(0, 6));
      } catch (err: any) {
        console.error('Home Page Fetch Error:', err);
        setError(err.message || 'Unable to load featured properties at this time.');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Find Your Next Home With <span className="text-indigo-400">YourRent</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Discover rental listings, connect directly with landlords, and manage lease payments seamlessly.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/properties"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg"
            >
              Browse All Properties
            </Link>
            <Link
              href="/register"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3 rounded-xl transition border border-slate-700"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Listings</h2>
            <p className="text-slate-500 text-sm mt-1">Explore top rentals available right now.</p>
          </div>
          <Link
            href="/properties"
            className="text-indigo-600 font-semibold text-sm hover:underline hidden sm:inline-block"
          >
            View all →
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 h-72 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            No featured properties available at the moment.
          </div>
        ) : (
          /* Property Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'}
                    alt={prop.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">{prop.city}</p>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{prop.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1">{prop.address}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-lg font-extrabold text-slate-900">
                    ${prop.price} <span className="text-xs font-normal text-slate-500">/mo</span>
                  </span>
                  <Link
                    href={`/properties/${prop.id}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/properties"
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            View all properties →
          </Link>
        </div>
      </section>

      {/*category bar  */}
      <CategoryBar />

      {/*how it works */}
      <HowItWorks />

      {/* popular locations */}
      <PopularLocations />

      {/* why choose us */}
      <WhyChooseUs />

      {/* landlord CTA */}
      <LandlordCTA />

      {/* testimonials and FAQ */}
      <TestimonialsAndFAQ />
    </div>
  );
}
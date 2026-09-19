'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  address: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
}

const PAGE_SIZE = 12;

// Safe extraction: handles plain arrays and object wrappers
const extractList = (response: any): Property[] => {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.properties)) return response.properties;
  return [];
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Category from the home page links (/properties?type=apartment), read once on mount
  const [type, setType] = useState('');
  const [ready, setReady] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (t) setType(t);
    setReady(true);
  }, []);

  const buildQuery = (pageNum: number) => {
    const query = new URLSearchParams();
    if (city) query.append('city', city);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (type) query.append('type', type);
    query.append('page', String(pageNum));
    query.append('limit', String(PAGE_SIZE));
    return query.toString();
  };

  // Reload from page 1 whenever a filter changes.
  // Typing is debounced and stale requests are cancelled, so we don't hit the API on every keystroke.
  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();
    const delay = isFirstLoad.current ? 0 : 400; // no artificial delay on the first load
    isFirstLoad.current = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchApi<any>(`/properties?${buildQuery(1)}`, {
          signal: controller.signal,
        });
        const list = extractList(response);
        setProperties(list);
        setPage(1);
        setHasMore(list.length === PAGE_SIZE);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setError(err.message || 'Failed to load properties. Check backend connection.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, city, minPrice, maxPrice, type]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    setError('');

    try {
      const response = await fetchApi<any>(`/properties?${buildQuery(nextPage)}`);
      const list = extractList(response);
      setProperties((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...list.filter((p) => !seen.has(p.id))];
      });
      setPage(nextPage);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || 'Failed to load more properties.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Explore Rental Properties</h1>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by City (e.g. Dhaka)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-100 h-72 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          No properties found matching your criteria.
        </div>
      ) : (
        /* Property Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
              <img
                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'}
                alt={prop.title}
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">{prop.city}</p>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{prop.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{prop.address}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-lg font-extrabold text-slate-900">${prop.price} <span className="text-xs font-normal text-slate-500">/mo</span></span>
                  <Link
                    href={`/properties/${prop.id}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded-xl transition"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
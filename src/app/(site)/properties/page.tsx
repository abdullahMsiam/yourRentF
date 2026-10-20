'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { categoryService } from '@/services/categoryService';
import PropertyCard from '@/components/properties/PropertyCard'; // PropertyCard ইমপোর্ট
import type { PropertyListItem, Category } from '@/services/types';

const PAGE_SIZE = 12;

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [ready, setReady] = useState(false);
  const isFirstLoad = useRef(true);

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('city');
    const cat = params.get('categoryId');
    const t = params.get('type');
    if (c) setCity(c);
    if (cat) setCategoryId(cat);
    setReady(true);
  }, []);

  // Load categories
  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {});
  }, []);

  // Fetch properties
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    const delay = isFirstLoad.current ? 0 : 400;
    isFirstLoad.current = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const list = await propertyService.list({
          city,
          minPrice,
          maxPrice,
          categoryId,
          page: 1,
          limit: PAGE_SIZE,
        });
        setProperties(list);
        setPage(1);
        setHasMore(list.length === PAGE_SIZE);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load properties.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [ready, city, minPrice, maxPrice, categoryId]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const list = await propertyService.list({
        city,
        minPrice,
        maxPrice,
        categoryId,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setProperties((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...list.filter((p) => !seen.has(p.id))];
      });
      setPage(nextPage);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more.');
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setCategoryId('');
  };

  const hasFilters = !!(city || minPrice || maxPrice || categoryId);

  const FiltersContent = (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          City
        </label>
        <input
          type="text"
          placeholder="e.g. Dhaka"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Price range ($)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-xs font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse Properties
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {loading ? 'Searching…' : `${properties.length}${hasMore ? '+' : ''} results`}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h2>
            </div>
            {FiltersContent}
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasFilters && <span className="text-indigo-600">•</span>}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-3 text-sm text-rose-700 dark:text-rose-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No properties found.</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 px-8 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer transition shadow-sm"
                  >
                    {loadingMore ? 'Loading…' : 'Load more properties'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">{FiltersContent}</div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition cursor-pointer"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
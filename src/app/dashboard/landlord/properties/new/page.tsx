'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Category {
  id: string;
  name: string;
}

export default function NewPropertyPage() {
  const router = useRouter();

  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    address: '',
    bedrooms: '1',
    bathrooms: '1',
    categoryId: '',
    amenities: '', // Comma-separated in form, converted to Array on submit
    images: '',    // Comma-separated in form, converted to Array on submit
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch available categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await fetchApi<any>('/categories');
        
        // Normalize categories payload (handles arrays or wrapped objects)
        const items = Array.isArray(response)
          ? response
          : response?.data || response?.categories || [];

        setCategories(items);

        // Pre-select the first category if available
        if (items.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: items[0].id }));
        }
      } catch (err: any) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Make sure your backend has created categories.');
      } finally {
        setFetchingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 2. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category for this property.');
      setLoading(false);
      return;
    }

    try {
      // Process input values into proper data types for backend/Prisma
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        city: formData.city,
        address: formData.address,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        categoryId: formData.categoryId,
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
          : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'],
      };

      // Calls POST /properties/landlord or /properties based on your route configuration
      await fetchApi('/properties/landlord', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Redirect back to Landlord Dashboard on success
      router.push('/dashboard/landlord');
      router.refresh();
    } catch (err: any) {
      console.error('Failed to create property:', err);
      setError(err.message || 'Could not create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Property</h1>
          <p className="text-slate-500 text-sm">List a new rental unit on YourRent.</p>
        </div>
        <Link
          href="/dashboard/landlord"
          className="text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          ← Cancel
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Property Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Modern 2-Bedroom Apartment in Gulshan"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
          {fetchingCategories ? (
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          ) : categories.length === 0 ? (
            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              No categories found. Please ask an Admin to create categories first.
            </p>
          ) : (
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            placeholder="Provide key details about the room, lease rules, utility availability..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Price & Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly Rent ($) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">City *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dhaka"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address *</label>
          <input
            type="text"
            required
            placeholder="e.g. House 12, Road 5, Block C"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Bedrooms & Bathrooms Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Bedrooms</label>
            <input
              type="number"
              min="1"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Bathrooms</label>
            <input
              type="number"
              min="1"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Amenities <span className="text-slate-400 font-normal">(Comma-separated)</span>
          </label>
          <input
            type="text"
            placeholder="WiFi, Air Conditioning, Generator, Parking"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Image URLs <span className="text-slate-400 font-normal">(Comma-separated links)</span>
          </label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || fetchingCategories || categories.length === 0}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            {loading ? 'Creating Listing...' : 'Publish Property Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
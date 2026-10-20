'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyService } from '@/services/propertyService';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/context/ToastContext';
import type { Category, CreatePropertyPayload } from '@/services/types';

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const propertyId = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    address: '',
    bedrooms: '1',
    bathrooms: '1',
    categoryId: '',
    amenities: '',
    images: '',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load categories + property in parallel
  useEffect(() => {
    const load = async () => {
      setFetchingData(true);
      setError('');
      try {
        const [cats, property] = await Promise.all([
          categoryService.list(),
          propertyService.getById(propertyId),
        ]);

        setCategories(cats);

        if (!property) {
          setError('Property not found.');
          return;
        }

        setFormData({
          title: property.title,
          description: property.description ?? '',
          price: String(property.price),
          city: property.city,
          address: property.address,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          categoryId: property.categoryId,
          amenities: property.amenities?.join(', ') ?? '',
          images: property.images?.join(', ') ?? '',
          isAvailable: property.isAvailable,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load property data.'
        );
      } finally {
        setFetchingData(false);
      }
    };
    load();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category.');
      setLoading(false);
      return;
    }

    try {
      const payload: Partial<CreatePropertyPayload> = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        city: formData.city,
        address: formData.address,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
          : [],
      };

      const res = await propertyService.update(propertyId, payload);

      if (res.count === 0) {
        throw new Error('Update failed — property may have been deleted or not owned by you.');
      }

      showToast('Property updated successfully', 'success');
      router.push('/dashboard/landlord/properties');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not update property.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-1/2" />
        <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
          <p className="text-slate-500 text-sm">Update listing details.</p>
        </div>
        <Link
          href="/dashboard/landlord/properties"
          className="text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Property Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Category *
          </label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Price + City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Monthly Rent ($) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Full Address *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Bedrooms + Bathrooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Amenities{' '}
            <span className="text-slate-400 font-normal">(Comma-separated)</span>
          </label>
          <input
            type="text"
            value={formData.amenities}
            onChange={(e) =>
              setFormData({ ...formData, amenities: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Image URLs{' '}
            <span className="text-slate-400 font-normal">(Comma-separated)</span>
          </label>
          <input
            type="text"
            value={formData.images}
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-3 pt-2">
          <input
            id="isAvailable"
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) =>
              setFormData({ ...formData, isAvailable: e.target.checked })
            }
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="isAvailable"
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            Available for rent
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-3">
          <Link
            href="/dashboard/landlord/properties"
            className="flex-1 text-center py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

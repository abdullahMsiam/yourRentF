'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Pencil, Eye, PlusCircle, Home } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/context/ToastContext';
import type { LandlordProperty } from '@/services/types';

export default function LandlordPropertiesPage() {
  const { showToast } = useToast();
  const [properties, setProperties] = useState<LandlordProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await propertyService.listMine();
      setProperties(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not fetch your properties.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await propertyService.remove(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      showToast('Property deleted successfully', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete property',
        'error'
      );
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Properties
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all your rental listings in one place.
          </p>
        </div>
        <Link
          href="/dashboard/landlord/properties/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={loadProperties}
            className="text-xs font-bold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Home className="w-7 h-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No properties yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Start building your portfolio by listing your first rental property.
            </p>
          </div>
          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const imageUrl = property.images?.[0];
            return (
              <div
                key={property.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
              >
                {/* Image */}
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {property.address}, {property.city}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      ${property.price}
                      <span className="text-xs font-medium text-slate-400">/mo</span>
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        property.isAvailable
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {property.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    {property.bedrooms} bd · {property.bathrooms} ba
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                    <Link
                      href={`/dashboard/landlord/properties/${property.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <button
                      onClick={() => setConfirmId(property.id)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      aria-label="Delete property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-lg">Delete this property?</h3>
            <p className="text-sm text-slate-600">
              This action cannot be undone. Related rental requests and reviews
              will also be removed.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmId(null)}
                disabled={!!deletingId}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={!!deletingId}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-60"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

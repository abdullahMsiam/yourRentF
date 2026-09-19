'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Property {
  id: string;
  title: string;
  city: string;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  isAvailable?: boolean;
  images?: string[];
  landlordId?: string;
  landlord?: { id: string };
}

export default function LandlordDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLandlordProperties = async () => {
    setLoading(true);
    setError('');

    try {
      // Dedicated endpoint returns only this landlord's properties
      const response = await fetchApi<any>('/properties/landlord');
      const myProperties: Property[] = Array.isArray(response)
        ? response
        : response?.data || response?.properties || [];

      setProperties(myProperties);
    } catch (err: any) {
      console.error('Failed to load landlord properties:', err);
      setError(err.message || 'Could not fetch your properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandlordProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Landlord Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your active rental property listings.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/landlord/requests"
            className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            Manage Rental Requests
          </Link>
          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
          >
            + Add New Property
          </Link>
        </div>
      </div>

      {/* Property List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Your Listed Properties ({properties.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-slate-500 text-sm">You haven't added any properties yet.</p>
            <Link
              href="/dashboard/landlord/properties/new"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-6">Property</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{property.title}</td>
                    <td className="py-4 px-6 text-slate-600">{property.city}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">${property.price}/mo</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
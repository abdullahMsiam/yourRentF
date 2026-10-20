'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import type { RentalRequest, RentalStatus } from '@/services/types';

const STATUS_BADGE: Record<RentalStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function TenantDashboardPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await rentalService.list();
      setRequests(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not fetch your rental requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tenant Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your submitted rental applications.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
        >
          Explore Properties
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={loadRequests}
            className="text-xs font-bold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl font-bold">
            🏠
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Rental Requests Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You haven&apos;t applied for any rental properties. Browse available listings and send a request!
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => {
            const property = req.property;
            const propertyImage =
              property?.images?.[0] ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                <div className="flex gap-4 items-center">
                  <div className="h-24 w-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={propertyImage}
                      alt={property?.title || 'Property'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">
                      {property?.title || 'Property Details Unavailable'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {property?.address
                        ? `${property.address}, ${property.city}`
                        : 'Location N/A'}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 pt-1">
                      Duration: {req.duration} months | Move-in:{' '}
                      {req.moveInDate
                        ? new Date(req.moveInDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 font-medium">Estimated Rent</p>
                    <p className="text-xl font-black text-slate-900">
                      ${req.totalAmount || (property?.price ? property.price * req.duration : 0)}
                    </p>
                  </div>

                  {req.status === 'APPROVED' && (
                    <Link
                      href={`/dashboard/tenant/requests/${req.id}/pay`}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition text-center shadow-xs"
                    >
                      Pay Rent Now →
                    </Link>
                  )}

                  {req.propertyId && (
                    <Link
                      href={`/properties/${req.propertyId}`}
                      className="w-full sm:w-auto border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition text-center"
                    >
                      View Listing
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

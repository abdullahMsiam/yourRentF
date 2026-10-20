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

export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await rentalService.list();
      setRequests(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not fetch tenant applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: 'APPROVED' | 'REJECTED'
  ) => {
    setUpdatingId(requestId);
    setError('');

    try {
      await rentalService.updateStatus(requestId, newStatus);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to update request to ${newStatus}.`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Rental Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review and respond to pending tenant requests for your properties.
          </p>
        </div>
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Alert */}
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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl font-bold">
            📋
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Rental Applications</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You don&apos;t have any tenant requests at the moment.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => {
            const property = req.property;
            const tenant = req.tenant;
            const propertyImage =
              property?.images?.[0] ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                {/* Left: Property + Tenant */}
                <div className="flex gap-4 items-center">
                  <img
                    src={propertyImage}
                    alt={property?.title || 'Property'}
                    className="h-24 w-28 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">
                      {property?.title || 'Property Title Unavailable'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Applicant:</strong>{' '}
                      {tenant?.name || tenant?.email || 'Tenant Info Hidden'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Duration: {req.duration} Months | Move-in:{' '}
                      {req.moveInDate
                        ? new Date(req.moveInDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 font-medium">Total Rent Value</p>
                    <p className="text-xl font-black text-slate-900">
                      ${req.totalAmount ?? (property?.price ? property.price * req.duration : 0)}
                    </p>
                  </div>

                  {req.status === 'PENDING' ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                        disabled={updatingId === req.id}
                        className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {updatingId === req.id ? 'Updating...' : 'Approve Application'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                        disabled={updatingId === req.id}
                        className="flex-1 sm:flex-initial bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Decision Recorded ({req.status})
                    </span>
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
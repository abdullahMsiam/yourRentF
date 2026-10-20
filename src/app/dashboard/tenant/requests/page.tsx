'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { rentalService } from '@/services/rentalService';
import type { RentalRequest, RentalStatus } from '@/services/types';

const STATUS_BADGE: Record<RentalStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const FILTERS: Array<{ value: RentalStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function TenantRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<RentalStatus | 'ALL'>('ALL');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await rentalService.list();
      setRequests(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = requests.filter((r) =>
    filter === 'ALL' ? true : r.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Rental Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track all your submitted rental applications.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
              filter === f.value
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={load}
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
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {filter === 'ALL' ? 'No requests yet' : `No ${filter.toLowerCase()} requests`}
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              {filter === 'ALL'
                ? 'Browse properties and send your first rental request.'
                : 'Try a different filter to see more requests.'}
            </p>
          </div>
          {filter === 'ALL' && (
            <Link
              href="/properties"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Browse Properties
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((req) => {
            const property = req.property;
            const imageUrl =
              property?.images?.[0] ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row gap-5 justify-between items-start md:items-center"
              >
                <div className="flex gap-4 items-center min-w-0">
                  <div className="h-20 w-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={imageUrl}
                      alt={property?.title || 'Property'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <h3 className="font-bold text-slate-900 line-clamp-1">
                      {property?.title || 'Property Unavailable'}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {property?.address
                        ? `${property.address}, ${property.city}`
                        : 'Location N/A'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Move-in: {new Date(req.moveInDate).toLocaleDateString()} ·{' '}
                      {req.duration} months
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 font-medium">Total</p>
                    <p className="text-lg font-black text-slate-900">
                      ${req.totalAmount}
                    </p>
                  </div>

                  {req.status === 'APPROVED' && (
                    <Link
                      href={`/dashboard/tenant/requests/${req.id}/pay`}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition text-center shadow-xs"
                    >
                      Pay Now →
                    </Link>
                  )}
                  {req.propertyId && (
                    <Link
                      href={`/properties/${req.propertyId}`}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition text-center"
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

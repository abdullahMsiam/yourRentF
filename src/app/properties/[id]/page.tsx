'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Landlord {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface Category {
  id: string;
  name: string;
}

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  location?: string;
  city: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  amenities?: string[] | string;
  images: string[];
  landlord?: Landlord;
  category?: Category;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const propertyId = params?.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('12');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!propertyId) return;

    const loadPropertyDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchApi<any>(`/properties/${propertyId}`);

        // Normalize response wrapper (handles direct object, { data: {...} }, or { property: {...} })
        const data = response?.data || response?.property || response;

        if (!data || !data.id) {
          throw new Error('Property details could not be found.');
        }

        setProperty(data);
      } catch (err: any) {
        console.error('Error loading property details:', err);
        setError(err.message || 'Failed to fetch property details.');
      } finally {
        setLoading(false);
      }
    };

    loadPropertyDetails();
  }, [propertyId]);

  // Handle Rental Request Submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      await fetchApi('/rentals', {
        method: 'POST',
        body: JSON.stringify({
          propertyId,
          moveInDate,
          duration: Number(duration),
          notes,
        }),
      });

      setRequestSuccess('Rental request submitted successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setRequestSuccess('');
      }, 2000);
    } catch (err: any) {
      setRequestError(err.message || 'Failed to submit rental request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to safely parse amenities list
  const getAmenitiesList = (): string[] => {
    if (!property?.amenities) return [];
    if (Array.isArray(property.amenities)) return property.amenities;
    if (typeof property.amenities === 'string') {
      return property.amenities.split(',').map((item) => item.trim());
    }
    return [];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
            <div className="h-32 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto my-16 px-4 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
          <p className="text-sm">{error || 'The requested property listing does not exist.'}</p>
        </div>
        <Link
          href="/properties"
          className="inline-block bg-slate-900 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-slate-800 transition"
        >
          ← Return to All Listings
        </Link>
      </div>
    );
  }

  const amenities = getAmenitiesList();
  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-slate-900">Properties</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                  activeImageIndex === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {property.city}
              </span>
              {property.category && (
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                  {property.category.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{property.title}</h1>
            <p className="text-slate-500 text-sm mt-1">{property.address}, {property.city}</p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Bedrooms</p>
              <p className="text-lg font-bold text-slate-900">{property.bedrooms ?? 'N/A'}</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-xs text-slate-400 font-semibold uppercase">Bathrooms</p>
              <p className="text-lg font-bold text-slate-900">{property.bathrooms ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Area Sqft</p>
              <p className="text-lg font-bold text-slate-900">{property.size ? `${property.size} sqft` : 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">About this property</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {property.description || 'No detailed description provided for this listing.'}
            </p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((item, index) => (
                  <span
                    key={index}
                    className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Booking Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Rent</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900">${property.price}</span>
                <span className="text-slate-500 text-sm font-medium">/ month</span>
              </div>
            </div>

            {/* Landlord Card Info */}
            {property.landlord && (
              <div className="border-t border-slate-100 pt-4 space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase">Listed By</p>
                <p className="text-sm font-bold text-slate-900">{property.landlord.name || 'Property Manager'}</p>
                {property.landlord.email && (
                  <p className="text-xs text-slate-500">{property.landlord.email}</p>
                )}
              </div>
            )}

            {/* Action Trigger */}
            {user?.role === 'LANDLORD' || user?.role === 'ADMIN' ? (
              <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs p-3.5 rounded-xl text-center">
                Rental requests can only be submitted by registered Tenant accounts.
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) router.push('/login');
                  else setIsModalOpen(true);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-sm cursor-pointer"
              >
                {isAuthenticated ? 'Request To Rent' : 'Sign In To Apply'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Apply for Rental</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
                {requestSuccess}
              </div>
            )}

            {requestError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                {requestError}
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Intended Move-In Date
                </label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lease Duration (Months)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes for Landlord (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Introduce yourself or share details..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
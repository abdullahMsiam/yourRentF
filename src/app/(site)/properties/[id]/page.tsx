'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Bed, Bath, CheckCircle2, Phone, Mail, User } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { rentalService } from '@/services/rentalService';
import { reviewService } from '@/services/reviewService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { PropertyDetail, PropertyListItem, Review } from '@/services/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const propertyId = params.id;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similar, setSimilar] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Rental request modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('12');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Review modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!propertyId) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await propertyService.getById(propertyId);
        if (!data) {
          setError('Property not found.');
          return;
        }
        setProperty(data);

        // Load similar in background
        propertyService
          .list({ categoryId: data.categoryId, limit: 4 })
          .then((list) => {
            setSimilar(list.filter((p) => p.id !== data.id).slice(0, 3));
          })
          .catch(() => {});
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch property details.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [propertyId]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      await rentalService.create({
        propertyId,
        moveInDate,
        duration: Number(duration),
        notes,
      });
      showToast('Rental request submitted!', 'success');
      setIsModalOpen(false);
      setMoveInDate('');
      setNotes('');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to submit request',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await reviewService.create({ propertyId, rating, comment });
      showToast('Review posted!', 'success');
      setReviewOpen(false);
      setComment('');
      // Reload to show new review
      const updated = await propertyService.getById(propertyId);
      if (updated) setProperty(updated);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to post review',
        'error'
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const avgRating =
    property?.reviews && property.reviews.length > 0
      ? (
          property.reviews.reduce((sum, r) => sum + r.rating, 0) /
          property.reviews.length
        ).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="h-8 bg-slate-100 rounded-xl w-2/3 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2 animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto my-16 px-4 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
          <p className="text-sm">{error || 'The requested listing does not exist.'}</p>
        </div>
        <Link
          href="/properties"
          className="inline-block bg-slate-900 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-slate-800 transition"
        >
          ← Back to All Listings
        </Link>
      </div>
    );
  }

  const amenities = property.amenities ?? [];
  const images =
    property.images && property.images.length > 0
      ? property.images
      : [FALLBACK_IMAGE];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-slate-900">Properties</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {property.title}
        </span>
      </nav>

      {/* Image gallery */}
      <div className="space-y-3">
        <div className="h-[280px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition duration-300"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-indigo-600 scale-95'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {property.city}
              </span>
              {property.category && (
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                  {property.category.name}
                </span>
              )}
              {avgRating && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {avgRating} ({property.reviews.length})
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Bed className="w-5 h-5" />, label: 'Bedrooms', value: property.bedrooms },
              { icon: <Bath className="w-5 h-5" />, label: 'Bathrooms', value: property.bathrooms },
              { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Availability', value: property.isAvailable ? 'Yes' : 'No' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="text-indigo-600 mb-2">{s.icon}</div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">About this property</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {property.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Reviews ({property.reviews?.length ?? 0})
              </h2>
              {user?.role === 'TENANT' && (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  + Write a review
                </button>
              )}
            </div>

            {property.reviews && property.reviews.length > 0 ? (
              <div className="space-y-3">
                {property.reviews.map((r) => (
                  <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{r.comment || 'No comment'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          <div className="sticky top-24 space-y-4">
            {/* Pricing card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Monthly Rent
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-slate-900">
                    ${property.price}
                  </span>
                  <span className="text-slate-500 text-sm">/ month</span>
                </div>
              </div>

              {/* Landlord card */}
              {property.landlord && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Listed by
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {property.landlord.name || 'Property Owner'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {property.landlord.email}
                      </p>
                    </div>
                  </div>
                  {property.landlord.phoneNumber && (
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {property.landlord.phoneNumber}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {property.landlord.email}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              {user?.role === 'LANDLORD' || user?.role === 'ADMIN' ? (
                <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs p-3 rounded-xl text-center">
                  Rental requests are only for tenant accounts.
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) router.push('/login');
                    else setIsModalOpen(true);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-sm cursor-pointer"
                >
                  {isAuthenticated ? 'Request to Rent' : 'Sign In to Apply'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Similar properties
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {p.city} — {p.address}
                  </p>
                  <p className="mt-2 font-bold text-indigo-600">
                    ${p.price}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Rental request modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Apply for Rental</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Move-in Date
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
                  Duration (months)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Introduce yourself…"
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
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-lg">Write a review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          n <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Comment
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience…"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-60"
                >
                  {reviewSubmitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

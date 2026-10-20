import Link from 'next/link';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import type { PropertyListItem } from '@/services/types';

interface PropertyCardProps {
  property: PropertyListItem;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    price,
    city,
    address,
    images,
    bedrooms,
    bathrooms,
    category,
    isAvailable,
  } = property;

  const imageUrl = images?.[0];

  return (
    <Link
      href={`/properties/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay for better text/badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
            No image available
          </div>
        )}

        {/* Top Badges (Availability & Category) */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {isAvailable !== undefined && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
              isAvailable 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-slate-800/90 text-white'
            }`}>
              {isAvailable ? 'Available' : 'Rented'}
            </span>
          )}
          {category?.name && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md">
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{city} — {address}</span>
          </p>
        </div>

        {/* Specs (Beds, Baths) */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 mb-5">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>{bathrooms} Baths</span>
          </div>
        </div>

        {/* Footer (Price + CTA) */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Price</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              ${price}
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500"> /mo</span>
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
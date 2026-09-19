import Link from 'next/link';
import { Property } from '@/types';
import { MapPin, Bed, Bath } from 'lucide-react';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div className="p-5 space-y-3">
        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
            alt={property.title}
            className="object-cover w-full h-full"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900">
            ${property.price} / mo
          </span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{property.title}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {property.address}, {property.city}
        </p>
        <div className="flex gap-4 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} Beds</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} Baths</span>
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <Link href={`/properties/${property.id}`} className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl text-sm transition">
          View Listing
        </Link>
      </div>
    </div>
  );
}
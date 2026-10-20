import Link from 'next/link';

const locations = [
  { city: 'Dhaka', count: '340+', img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=600' },
  { city: 'Chattogram', count: '220+', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
  { city: 'Sylhet', count: '180+', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600' },
  { city: 'Rajshahi', count: '150+', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { city: 'Khulna', count: '120+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600' },
  { city: 'Barishal', count: '95+', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { city: 'Faridpur', count: '80+', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600' },
  { city: 'Rangpur', count: '75+', img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=600' },
  { city: 'Mymensingh', count: '70+', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=600' },
  { city: 'Cumilla', count: '65+', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=600' },
  { city: 'Gazipur', count: '60+', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600' },
  { city: 'Narayanganj', count: '50+', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
];

export default function PopularLocations() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Popular locations
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-lg">
            Find rental properties in the most sought-after cities and neighborhoods.
          </p>
        </div>
        <Link
          href="/properties"
          className="text-indigo-600 font-semibold text-sm hover:underline self-start md:self-auto"
        >
          Browse all cities →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {locations.map((loc) => (
          <Link
            key={loc.city}
            href={`/properties?city=${encodeURIComponent(loc.city)}`}
            className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src={loc.img}
              alt={loc.city}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="text-sm font-bold line-clamp-1">{loc.city}</h3>
              <p className="text-[10px] text-slate-300 font-medium">{loc.count} rentals</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

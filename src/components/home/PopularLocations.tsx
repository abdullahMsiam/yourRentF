import Link from 'next/link';

const locations = [
  { city: 'Dhaka', count: '140+ Rentals', img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=600' },
  { city: 'Rajshahi', count: '65+ Rentals', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
  { city: 'Faridpur', count: '30+ Rentals', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600' },
  { city: 'Sylhet', count: '85+ Rentals', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
];

export default function PopularLocations() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Explore Top Locations</h2>
          <p className="text-slate-500 text-sm mt-2">Find available property listings in prime cities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {locations.map((loc) => (
          <Link
            key={loc.city}
            href={`/properties?location=${loc.city}`}
            className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <img
              src={loc.img}
              alt={loc.city}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-bold">{loc.city}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">{loc.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
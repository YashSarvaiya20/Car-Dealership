import { Car, Zap, Compass, Flame } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    title: 'SUV',
    description: 'Rugged capability, high clearance, and spacious cabins for all adventures.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    icon: Compass,
  },
  {
    id: 2,
    title: 'Sedan',
    description: 'Refined comfort, executive styling, and optimized fuel economy.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80',
    icon: Car,
  },
  {
    id: 3,
    title: 'Sports',
    description: 'High-speed handling, aerodynamic contours, and intense acceleration.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    icon: Flame,
  },
  {
    id: 4,
    title: 'Electric',
    description: 'Zero emission drivetrains, silent runs, and state-of-the-art tech.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    icon: Zap,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Featured Categories</h2>
          <p className="text-xs text-slate-400">Find the perfect class of vehicle that matches your lifestyle</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="bg-[#1A2332] hover:bg-[#202C3F] border border-slate-850 rounded-xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image header */}
                <div className="w-full h-40 overflow-hidden relative">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#0B1120]/40"></div>
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Info body */}
                <div className="p-6 space-y-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

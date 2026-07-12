import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-20 bg-transparent border-t border-slate-850">
      <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Ready to Find Your Next Car?
        </h2>
        <p className="text-sm sm:text-md text-slate-400 max-w-xl mx-auto leading-relaxed">
          Step into premium comfort and high-speed elegance today. Explore our catalog of meticulously verified luxury vehicles.
        </p>
        <div className="pt-4">
          <Link
            to="/catalog"
            className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    </section>
  );
}

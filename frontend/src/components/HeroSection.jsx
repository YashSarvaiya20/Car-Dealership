import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();
  
  const explorePath = user ? '/catalog' : '/login';
  const getStartedPath = user ? '/catalog' : '/register';

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#111827] to-[#0B1120] overflow-hidden border-b border-slate-850">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80"
          alt="Premium luxury car background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#0B1120]/75"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center sm:text-left w-full space-y-8">
        <div className="max-w-2xl space-y-6">
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Welcome to DriveSphere
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Drive Your <span className="text-blue-500">Dream Car</span> Today
          </h1>
          <p className="text-sm sm:text-md text-slate-355 font-medium max-w-lg leading-relaxed">
            Discover premium vehicles from trusted dealerships. Simple, secure transactions. Meticulously inspected inventory.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-4">
          <Link
            to={explorePath}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors active:scale-95 text-center cursor-pointer"
          >
            Explore Inventory
          </Link>
          <Link
            to={getStartedPath}
            className="px-8 py-3.5 bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors active:scale-95 text-center cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

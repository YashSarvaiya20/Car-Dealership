import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Toast from './Toast';

export default function FeaturedVehicles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLatestVehicles();
  }, []);

  const fetchLatestVehicles = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await client.get('/api/vehicles/search');
      // Take maximum 6 latest vehicles
      setVehicles(response.data.slice(0, 6));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (vehicleId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await client.post(`/api/vehicles/${vehicleId}/purchase`);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, quantity: v.quantity - 1 } : v))
      );
      setToast({ message: 'Successfully purchased vehicle!', type: 'success' });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to process purchase';
      setToast({ message, type: 'error' });
    }
  };

  return (
    <section className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Vehicles</h2>
            <p className="text-xs text-slate-500">Explore some of our latest arrivals and premium selections</p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="self-start md:self-end px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            View All Catalog &rarr;
          </button>
        </div>

        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-pulse">
                <div className="w-full h-44 bg-slate-100 rounded-lg"></div>
                <div className="h-4 bg-slate-100 w-1/3 rounded"></div>
                <div className="h-6 bg-slate-100 w-3/4 rounded"></div>
                <div className="h-8 bg-slate-100 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-slate-200 rounded-xl bg-white">
            <p className="text-xs text-rose-600 font-bold mb-4">Could not load featured inventory.</p>
            <button
              onClick={fetchLatestVehicles}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center gap-4">
            <svg className="w-16 h-16 text-slate-400 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">No vehicles available yet.</h4>
              <p className="text-xs text-slate-500">Check back later or check in with our support team.</p>
            </div>
          </div>
        ) : (
          /* Grid list of vehicles */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-[#1A2332] hover:bg-[#202C3F] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="w-full h-[220px] bg-slate-950 rounded-lg overflow-hidden mb-4 border border-slate-850 flex items-center justify-center relative">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600">
                        <svg className="w-10 h-10 stroke-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Category badge */}
                  <div className="mb-2">
                    <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      {v.category}
                    </span>
                  </div>

                  {/* Vehicle Name */}
                  <h4 className="text-lg font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors mb-1">
                    {v.make} {v.model}
                  </h4>

                  {/* Price */}
                  <p className="text-2xl font-extrabold text-white tracking-tight mb-3">
                    ${v.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>

                  {/* Availability Badge */}
                  <div>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      v.quantity > 0 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {v.quantity > 0 ? `${v.quantity} Available` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  {user?.isAdmin ? (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed"
                      >
                        Purchase Disabled
                      </button>
                      <p className="text-[10px] text-slate-400 leading-normal text-center">
                        Administrators manage inventory. Please use a customer account to purchase vehicles.
                      </p>
                    </div>
                  ) : v.quantity > 0 ? (
                    <button
                      onClick={() => handlePurchase(v.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                    >
                      {user ? 'Purchase Now' : 'Login to Purchase'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

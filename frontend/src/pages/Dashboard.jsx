import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Toast from '../components/Toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (make.trim()) params.make = make;
      if (model.trim()) params.model = model;
      if (category) params.category = category;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      if (onlyInStock) params.minQuantity = 1;

      const response = await client.get('/api/vehicles/search', { params });
      setVehicles(response.data);
    } catch (error) {
      setToast({ message: 'Failed to load vehicles', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleClearFilters = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    
    setTimeout(() => {
      client.get('/api/vehicles/search').then(res => setVehicles(res.data));
    }, 0);
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
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to purchase vehicle';
      setToast({ message, type: 'error' });
    }
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-[#1E293B] border border-slate-700 shadow-md rounded-xl p-6 sticky top-24">
          <h3 className="text-md font-bold text-white mb-4">Filter Inventory</h3>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Make
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-xs"
                placeholder="e.g. Toyota"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-xs"
                placeholder="e.g. Camry"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
              >
                <option value="">All Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="onlyInStock"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="onlyInStock" className="text-xs font-semibold text-slate-300 select-none">
                In Stock Only
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="w-8 h-8 border-4 border-slate-850 border-t-blue-500 rounded-full animate-spin"></span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-805 rounded-xl bg-slate-900/10">
            <p className="text-slate-400 text-sm">No vehicles found matching criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-[#1A2332] hover:bg-[#202C3F] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="w-full h-[220px] bg-slate-950 rounded-lg overflow-hidden mb-4 border border-slate-850 flex items-center justify-center relative">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600">
                        <svg className="w-12 h-12 stroke-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      {user ? 'Purchase Now' : 'Log in to Purchase'}
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
    </div>
  );
}

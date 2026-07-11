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
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-xs"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-xs"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-slate-200 focus:outline-none transition-colors text-xs"
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
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="onlyInStock" className="text-xs font-semibold text-slate-300 select-none">
                In Stock Only
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg active:scale-95 transition-all shadow-blue-500/10"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
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
            <span className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
            <p className="text-slate-400 text-sm">No vehicles found matching criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      {v.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      v.quantity > 0 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                    }`}>
                      {v.quantity > 0 ? `${v.quantity} Available` : 'Out of Stock'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {v.make} {v.model}
                  </h4>
                  <p className="text-2xl font-black text-white mt-4 tracking-tight">
                    ${v.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  {v.quantity > 0 ? (
                    <button
                      onClick={() => handlePurchase(v.id)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center"
                    >
                      {user ? 'Purchase Now' : 'Log in to Purchase'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-950 border border-slate-900 text-slate-600 text-xs font-bold rounded-xl cursor-not-allowed"
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

import { useState, useEffect } from 'react';
import client from '../api/client';
import Toast from '../components/Toast';

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await client.get('/api/vehicles/search');
      setVehicles(response.data);
    } catch (error) {
      setToast({ message: 'Failed to load inventory', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!make.trim()) newErrors.make = 'Make is required';
    if (!model.trim()) newErrors.model = 'Model is required';
    if (!category) newErrors.category = 'Category is required';
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const numQty = parseInt(quantity);
    if (isNaN(numQty) || numQty < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    if (!editingId && !imageFile) {
      newErrors.image = 'Vehicle image is required';
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      newErrors.image = 'File size exceeds the limit of 5 MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setMake('');
    setModel('');
    setCategory('Sedan');
    setPrice('');
    setQuantity('');
    setImageFile(null);
    setImagePreview('');
    setErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setMake(v.make);
    setModel(v.model);
    setCategory(v.category);
    setPrice(v.price.toString());
    setQuantity(v.quantity.toString());
    setImageFile(null);
    setImagePreview(v.imageUrl || '');
    setErrors({});
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('make', make.trim());
    formData.append('model', model.trim());
    formData.append('category', category);
    formData.append('price', parseFloat(price));
    formData.append('quantity', parseInt(quantity));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      if (editingId) {
        const response = await client.put(`/api/vehicles/${editingId}`, formData, config);
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingId ? response.data : v))
        );
        setToast({ message: 'Vehicle updated successfully!', type: 'success' });
      } else {
        const response = await client.post('/api/vehicles', formData, config);
        setVehicles((prev) => [response.data, ...prev]);
        setToast({ message: 'Vehicle created successfully!', type: 'success' });
      }
      setIsOpen(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save vehicle details';
      setToast({ message, type: 'error' });
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) {
      return;
    }

    try {
      await client.delete(`/api/vehicles/${vehicleId}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      setToast({ message: 'Vehicle deleted from inventory', type: 'success' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete vehicle';
      setToast({ message, type: 'error' });
    }
  };

  // Route parameters and authorization are managed by ProtectedRoute

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Inventory Management</h2>
          <p className="text-sm text-slate-400">Add, edit, or delete dealership vehicles</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-lg shadow-blue-500/20"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></span>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <p className="text-slate-400 text-sm">No vehicles in inventory. Add one above.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Make & Model</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4">
                      {v.imageUrl ? (
                        <img
                          src={v.imageUrl}
                          alt={`${v.make} ${v.model}`}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-800 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-800 border border-slate-700/50 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {v.make} {v.model}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/50">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      ${v.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={v.quantity > 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        {v.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 text-rose-400 hover:text-rose-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-md font-bold text-white">
                {editingId ? 'Edit Vehicle Details' : 'Add New Inventory Vehicle'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Make
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. Toyota"
                    required
                  />
                  {errors.make && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.make}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. Camry"
                    required
                  />
                  {errors.model && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.model}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
                {errors.category && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.category}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Vehicle Image
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-colors"
                />
                {imagePreview && (
                  <div className="mt-4 flex items-center justify-center p-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-48">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-44 object-contain rounded-lg"
                    />
                  </div>
                )}
                {errors.image && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.image}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="25000.00"
                    required
                  />
                  {errors.price && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.price}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="10"
                    required
                  />
                  {errors.quantity && <span className="text-rose-400 text-[10px] font-bold mt-1 block">{errors.quantity}</span>}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all shadow-blue-500/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

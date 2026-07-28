import React, { useState } from 'react';
import axios from 'axios';
import { X, Utensils } from 'lucide-react';

const API_BASE = 'https://restaurant-frontend-c2vc.onrender.com';

export default function AddMenuItemModal({ onClose, onMenuUpdated }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return alert('Please enter item name and price');

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/menu`, {
        name,
        category,
        price: Number(price),
        isAvailable: true
      });
      alert('Menu item added successfully!');
      onMenuUpdated();
      onClose();
    } catch (err) {
      alert('Failed to add item: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <Utensils className="text-amber-500" size={22} />
          <h3 className="font-extrabold text-lg">Add New Menu Item</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Chicken Tikka"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="Main Course">Main Course</option>
              <option value="Starters">Starters</option>
              <option value="Breads">Breads</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
              <option value="South Indian">South Indian</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price (₹)</label>
            <input
              type="number"
              placeholder="180"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            {loading ? 'Saving Item...' : 'Add to Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}

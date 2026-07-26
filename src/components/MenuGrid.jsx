import React from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';

export default function MenuGrid({ menu, categories, activeCategory, setActiveCategory, search, setSearch, onAddToCart }) {
  const filteredItems = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 p-6 border-r border-slate-200 overflow-hidden">
      {/* Header & Search */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gourmet Diner POS</h1>
          <p className="text-xs text-slate-500 font-medium">Quick Order & Billing Console</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 align-content-start">
        {filteredItems.map(item => (
          <div
            key={item._id}
            onClick={() => onAddToCart(item)}
            className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98]"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-2 line-clamp-2 group-hover:text-amber-600 transition">
                {item.name}
              </h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-black text-slate-900">₹{item.price}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-100/60 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                + Add
              </span>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center text-slate-400">
            <UtensilsCrossed size={48} strokeWidth={1.5} className="mb-2" />
            <p className="text-sm font-semibold">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { ClothingItem } from '../types';

interface Props {
  items: ClothingItem[];
}

const SearchPage: React.FC<Props> = ({ items }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Corsets', 'Mesh', 'Satin', 'Sparkle', 'Basics'];

  const filteredItems = items.filter(item => 
    (query === '' || item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())) &&
    (selectedCat === 'All' || item.vibe.some(v => v.includes(selectedCat)) || item.title.includes(selectedCat))
  );

  return (
    <div className="p-6 pt-12 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-black syne italic">FIND YOUR FIT</h1>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by description..." 
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:border-cyan-400 transition-all text-sm font-medium"
          />
        </div>
        <button className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
          <SlidersHorizontal size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`flex-shrink-0 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedCat === cat 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10">
        {filteredItems.map(item => (
          <div key={item.id} className="group">
            <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden mb-3 shadow-lg">
              <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-2xl text-[10px] font-black italic">
                ${item.pricePerDay}/day
              </div>
            </div>
            <h3 className="font-bold text-sm truncate">{item.title}</h3>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{item.brand}</p>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-2 py-20 text-center">
            <p className="text-gray-500 font-bold italic">Nothing found... try another vibe ✨</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

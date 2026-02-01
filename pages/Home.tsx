
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { ClothingItem } from '../types';

interface Props {
  items: ClothingItem[];
}

const HomePage: React.FC<Props> = ({ items }) => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'all'>('for-you');

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h1 className="text-4xl reve-bubble-text italic leading-none">Rêve</h1>
          <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40 mt-1">University Verified</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-[10px] font-bold flex items-center gap-2">
            <ShoppingBag size={14} className="text-cyan-400" />
            3 FREE BORROWS
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-10 h-56 group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <img 
          src="https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          alt="Style Vibe" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-widest font-black text-cyan-400">Personalized Match</span>
          </div>
          <h2 className="text-3xl font-bold syne leading-none italic mb-1">Going out tonight?</h2>
          <p className="text-gray-300 text-xs font-medium">14 tops on campus match your vibe.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 px-2">
        <button 
          onClick={() => setActiveTab('for-you')}
          className={`text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'for-you' ? 'text-white' : 'text-gray-600'}`}
        >
          For You
          {activeTab === 'for-you' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'all' ? 'text-white' : 'text-gray-600'}`}
        >
          Trending
          {activeTab === 'all' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />}
        </button>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-2 gap-5">
        {items.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden mb-3 shadow-xl">
              <img 
                src={item.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={item.title} 
              />
              <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-xl text-[9px] font-black flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                {item.lenderRating.toFixed(1)}
              </div>
              <div className="absolute bottom-4 left-3 bg-white/90 backdrop-blur-md text-black px-3 py-1.5 rounded-2xl text-[10px] font-black italic shadow-lg">
                ${item.pricePerDay}/day
              </div>
            </div>
            <h3 className="font-bold text-sm tracking-tight truncate">{item.title}</h3>
            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">{item.brand} • Size {item.size}</p>
          </div>
        ))}
      </div>

      {/* Community Section */}
      <div className="mt-14 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold syne italic">Style Council</h2>
          <button className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1 bg-cyan-400/10 px-3 py-1 rounded-full">
            EXPLORE <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 mb-2">
                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden shadow-xl">
                  <img src={`https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200&sig=${n}`} className="w-full h-full object-cover" alt="Influencer" />
                </div>
              </div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">@nyu_{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

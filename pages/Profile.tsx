
import React, { useState } from 'react';
import { Settings, Grid, Share2, Heart, MessageSquare } from 'lucide-react';
import { User, ClothingItem } from '../types';

interface Props {
  user: User;
  items: ClothingItem[];
}

const ProfilePage: React.FC<Props> = ({ user, items }) => {
  const [activeTab, setActiveTab] = useState<'fits' | 'closet' | 'saved'>('fits');

  return (
    <div className="min-h-screen">
      <header className="p-6 pb-2">
        <div className="flex justify-between items-start mb-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          <div className="flex gap-3">
            <button className="p-2 glass-card rounded-xl">
              <Share2 size={20} />
            </button>
            <button className="p-2 glass-card rounded-xl">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black syne mb-1">{user.name}</h1>
          <p className="text-cyan-400 text-sm font-bold mb-3">{user.handle} • {user.university}</p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{user.bio}</p>
        </div>

        <div className="flex gap-8 mb-8">
          <div>
            <div className="text-lg font-black">{user.rating.toFixed(1)}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Rating</div>
          </div>
          <div>
            <div className="text-lg font-black">1.2k</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Followers</div>
          </div>
          <div>
            <div className="text-lg font-black">{items.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Items</div>
          </div>
        </div>

        <button className="w-full py-3 bg-white text-black font-black italic rounded-2xl mb-8 active:scale-[0.98] transition-all">
          EDIT CLOSET
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-t border-white/10">
        <button 
          onClick={() => setActiveTab('fits')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'fits' ? 'text-white border-t-2 border-white' : 'text-gray-500'}`}
        >
          <Grid size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">My Fits</span>
        </button>
        <button 
          onClick={() => setActiveTab('closet')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'closet' ? 'text-white border-t-2 border-white' : 'text-gray-500'}`}
        >
          <Grid size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Closet</span>
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'saved' ? 'text-white border-t-2 border-white' : 'text-gray-500'}`}
        >
          <Heart size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {activeTab === 'closet' ? (
          items.map((item) => (
            <div key={item.id} className="aspect-square bg-gray-900 overflow-hidden group relative">
              <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.title} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-xs">${item.pricePerDay}</span>
              </div>
            </div>
          ))
        ) : (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gray-900 overflow-hidden relative group">
              <img src={`https://picsum.photos/seed/fit_${i}/400`} className="w-full h-full object-cover" alt="Fit" />
              <div className="absolute bottom-2 left-2 text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-[10px] font-bold"><Heart size={10} /> 12</div>
                <div className="flex items-center gap-1 text-[10px] font-bold"><MessageSquare size={10} /> 2</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

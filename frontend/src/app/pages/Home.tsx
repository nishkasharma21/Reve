import { Search, SlidersHorizontal, Sparkles, Home as HomeIcon, MessageCircle, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ItemCard } from '../components/ItemCard';
import { OutfitCard } from '../components/OutfitCard';

export function Home() {
  const [activeTab, setActiveTab] = useState<'items' | 'outfits'>('items');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Mock data for items
  const mockItems = [
    { itemName: 'Chrome Mini Dress', brand: 'Edikted', size: 'M', category: 'Dress', price: '$12/day' },
    { itemName: 'Neon Mesh Top', brand: 'Princess Polly', size: 'S', category: 'Top', price: '$8/day' },
    { itemName: 'Holographic Skirt', brand: 'White Fox', size: 'L', category: 'Skirt', price: '$10/day' },
    { itemName: 'Oversized Puffer', brand: 'Edikted', size: 'M', category: 'Jacket', price: '$15/day' },
    { itemName: 'Sequin Bodysuit', brand: 'Princess Polly', size: 'S', category: 'Top', price: '$9/day' },
    { itemName: 'Leather Mini Skirt', brand: 'White Fox', size: 'M', category: 'Skirt', price: '$11/day' },
  ];

  // Mock data for outfits
  const mockOutfits = [
    {
      username: 'luna_vibe',
      caption: 'rave szn is back 💜✨',
      likes: 834,
      comments: 52,
      taggedItems: ['Chrome Dress', 'Platform Boots', 'Mini Bag'],
    },
    {
      username: 'cyber_queen',
      caption: 'neon nights 🌙',
      likes: 612,
      comments: 38,
      taggedItems: ['Mesh Top', 'Cargo Pants'],
    },
    {
      username: 'rave_bae',
      caption: 'festival ready 🎪',
      likes: 1205,
      comments: 89,
      taggedItems: ['Bodysuit', 'Skirt', 'Boots', 'Sunglasses'],
    },
    {
      username: 'electric_girl',
      caption: 'vibing hard tonight',
      likes: 421,
      comments: 27,
      taggedItems: ['Holographic Top', 'Shorts'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20 relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      {/* Top Navigation */}
      <header className="bg-[#1a1a24]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Logo and search */}
          <div className="flex items-center gap-6 mb-4">
            <div 
              className="text-3xl font-black tracking-tight cursor-pointer"
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #ff00ff, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              REVE
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search items, brands, vibes..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff00ff]/50 focus:ring-1 focus:ring-[#ff00ff]/50 transition-all"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#ff00ff]/50 transition-all"
              >
                <SlidersHorizontal size={20} className="text-white" />
              </button>
            </div>
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/home')}
                className="text-white/60 hover:text-white transition-colors"
              >
                Discover
              </button>
              <button 
                onClick={() => navigate('/messages')}
                className="text-white/60 hover:text-white transition-colors"
              >
                Messages
              </button>
              <button 
                //onClick={() => window.location.href = 'https://goreve-d2e7c1150e3c.herokuapp.com/saml/logout'} need to change this to use env variable
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/saml/logout`}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-red-500/50 rounded-lg transition-all"
              >
                Log Out
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] border-2 border-white/20"
              />
            </nav>
          </div>

          {/* Tab toggle */}
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1.5 border border-white/10">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'items'
                  ? 'bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white shadow-lg shadow-[#ff00ff]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'outfits'
                  ? 'bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white shadow-lg shadow-[#ff00ff]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Outfits
            </button>
          </div>
        </div>
      </header>

      {/* Filters Sidebar */}
      {showFilters && (
        <aside className="fixed left-0 top-[140px] bottom-20 w-80 bg-[#1a1a24]/95 backdrop-blur-lg border-r border-white/10 z-30 p-6 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">Filters</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Category</label>
              <div className="space-y-2">
                {['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Accessories'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Size</label>
              <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 hover:border-[#ff00ff]/50 transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Price Range</label>
              <input 
                type="range" 
                min="0" 
                max="50" 
                className="w-full accent-[#ff00ff]"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Vibe</label>
              <div className="flex gap-2 flex-wrap">
                {['Rave', 'Y2K', 'Grunge', 'Edgy', 'Party'].map((vibe) => (
                  <button
                    key={vibe}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-gradient-to-r hover:from-[#ff00ff] hover:to-[#9d00ff] hover:border-transparent transition-all"
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-6 py-8 relative z-10 transition-all ${showFilters ? 'ml-80' : ''}`}>
        {/* AI Recommendation Label */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#ff00ff]/10 to-[#00d4ff]/10 border border-[#ff00ff]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00d4ff] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Recommended for you</div>
              <div className="text-sm text-white/60">Based on your vibe and activity</div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {activeTab === 'items' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockItems.map((item, index) => (
                <ItemCard key={index} {...item} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockOutfits.map((outfit, index) => (
                <OutfitCard key={index} {...outfit} />
              ))}
            </div>
          )}
        </div>

        {/* "More like this" section */}
        <div className="mt-12 p-6 rounded-2xl bg-[#1a1a24]/50 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={24} className="text-[#ff00ff]" />
            <h3 className="text-xl font-bold text-white">More like this</h3>
            <span className="text-sm text-white/40 ml-auto">AI adapts to your activity</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex-shrink-0 w-40 h-52 bg-white/5 border border-white/10 rounded-xl hover:border-[#ff00ff]/50 transition-all cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Load more indicator */}
        <div className="text-center py-12">
          <div className="inline-block w-10 h-10 border-4 border-white/10 border-t-[#ff00ff] rounded-full animate-spin" />
          <p className="text-sm text-white/40 mt-3">Loading more {activeTab}...</p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a24]/95 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-[#ff00ff]">
              <HomeIcon size={24} />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => navigate('/search')} className="flex flex-col items-center gap-1 text-white/40">
              <Search size={24} />
              <span className="text-xs">Search</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white/40">
              <div className="w-12 h-12 -mt-2 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex items-center justify-center shadow-lg shadow-[#ff00ff]/50">
                <Sparkles size={24} className="text-white" />
              </div>
            </button>
            <button onClick={() => navigate('/messages')} className="flex flex-col items-center gap-1 text-white/40">
              <MessageCircle size={24} />
              <span className="text-xs">Messages</span>
            </button>
            <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-white/40">
              <User size={24} />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

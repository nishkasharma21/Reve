import { MessageCircle, Heart, Bookmark, Star, Home, Search, Sparkles, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function Profile() {
  const [activeTab, setActiveTab] = useState<'outfits' | 'wardrobe' | 'saved'>('outfits');
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  // Mock data
  const mockOutfitPosts = [
    { id: 1, likes: 834, comments: 52, caption: 'rave szn is back 💜✨', taggedItems: 3 },
    { id: 2, likes: 612, comments: 38, caption: 'neon nights 🌙', taggedItems: 2 },
    { id: 3, likes: 1205, comments: 89, caption: 'festival ready 🎪', taggedItems: 4 },
    { id: 4, likes: 421, comments: 27, caption: 'vibing hard tonight', taggedItems: 3 },
    { id: 5, likes: 756, comments: 45, caption: 'party mode activated', taggedItems: 5 },
    { id: 6, likes: 589, comments: 32, caption: 'electric energy', taggedItems: 2 },
  ];

  const mockWardrobeItems = [
    { id: 1, name: 'Chrome Mini Dress', brand: 'Edikted', size: 'M', price: '$12/day', available: true },
    { id: 2, name: 'Neon Mesh Top', brand: 'Princess Polly', size: 'S', price: '$8/day', available: true },
    { id: 3, name: 'Holographic Skirt', brand: 'White Fox', size: 'L', price: '$10/day', available: false },
    { id: 4, name: 'Oversized Puffer', brand: 'Edikted', size: 'M', price: '$15/day', available: true },
    { id: 5, name: 'Sequin Bodysuit', brand: 'Princess Polly', size: 'S', price: '$9/day', available: true },
    { id: 6, name: 'Platform Boots', brand: 'White Fox', size: '8', price: '$14/day', available: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20 relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      {/* Header Section */}
      <header className="bg-[#1a1a24]/80 backdrop-blur-lg border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Profile info */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff00ff] via-[#9d00ff] to-[#00d4ff] p-1">
              <div className="w-full h-full rounded-full bg-[#1a1a24] flex items-center justify-center">
                <UserIcon size={48} className="text-white/40" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-black text-3xl text-white mb-2">luna_vibe</h1>
              <p className="text-white/70 mb-6 max-w-md">
                UCLA '26 🎓 Rave fashion obsessed 💜 Sharing my closet with the vibes ✨
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div>
                  <div className="font-bold text-2xl text-white">3.8K</div>
                  <div className="text-sm text-white/50">Followers</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-white">1.2K</div>
                  <div className="text-sm text-white/50">Following</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-white">42</div>
                  <div className="text-sm text-white/50">Items Listed</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 md:flex-initial px-8 py-3 rounded-xl font-bold transition-all ${
                    isFollowing
                      ? 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                      : 'bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white shadow-lg shadow-[#ff00ff]/30 hover:shadow-[#ff00ff]/50'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="flex-1 md:flex-initial px-8 py-3 bg-white/5 border border-white/20 rounded-xl font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Rating indicator */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#ff00ff]/10 to-[#00d4ff]/10 border border-[#ff00ff]/20 rounded-xl px-5 py-3 w-fit">
            <Star size={20} className="text-[#ff00ff]" fill="#ff00ff" />
            <span className="font-bold text-white">4.9</span>
            <span className="text-sm text-white/60">(127 ratings)</span>
            <span className="text-sm text-white/40 ml-2">Trusted Lender</span>
          </div>
        </div>
      </header>

      {/* Tabbed Interface */}
      <div className="sticky top-0 bg-[#1a1a24]/80 backdrop-blur-lg border-b border-white/10 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('outfits')}
              className={`flex-1 py-4 font-bold border-b-2 transition-all ${
                activeTab === 'outfits'
                  ? 'border-[#ff00ff] text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Outfits
            </button>
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`flex-1 py-4 font-bold border-b-2 transition-all ${
                activeTab === 'wardrobe'
                  ? 'border-[#ff00ff] text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Wardrobe
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 font-bold border-b-2 transition-all ${
                activeTab === 'saved'
                  ? 'border-[#ff00ff] text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Saved
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Outfits Tab */}
        {activeTab === 'outfits' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockOutfitPosts.map((post) => (
              <div key={post.id} className="relative group cursor-pointer">
                <div className="aspect-[3/4] bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden hover:border-[#ff00ff]/50 transition-all">
                  <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                    <div className="w-24 h-32 border-2 border-white/10 rounded-lg" />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/80 to-[#9d00ff]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Heart size={24} fill="white" />
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={24} fill="white" />
                      <span className="font-bold">{post.comments}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/80 mt-2 line-clamp-1">{post.caption}</p>
                <p className="text-xs text-white/40">🏷️ {post.taggedItems} items</p>
              </div>
            ))}
          </div>
        )}

        {/* Wardrobe Tab */}
        {activeTab === 'wardrobe' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockWardrobeItems.map((item) => (
              <div key={item.id} className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#ff00ff]/50 hover:shadow-lg hover:shadow-[#ff00ff]/20 transition-all">
                <div className="aspect-[3/4] bg-[#0a0a0f] flex items-center justify-center relative">
                  <div className="w-20 h-28 border-2 border-white/10 rounded-lg" />
                  {/* Availability badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold ${
                      item.available
                        ? 'bg-gradient-to-r from-[#00d4ff] to-[#00ffff] text-black'
                        : 'bg-white/10 text-white/60 border border-white/20'
                    }`}
                  >
                    {item.available ? 'Available' : 'Borrowed'}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-bold text-sm text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/60">{item.brand}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-white/50">Size {item.size}</span>
                    <span className="font-bold text-sm text-[#00d4ff]">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Saved Outfits</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-[3/4] bg-[#1a1a24] border border-white/10 rounded-xl flex items-center justify-center hover:border-[#ff00ff]/50 transition-all cursor-pointer">
                    <div className="w-20 h-28 border-2 border-white/10 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Saved Items</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="aspect-[3/4] bg-[#1a1a24] border border-white/10 rounded-xl flex items-center justify-center hover:border-[#ff00ff]/50 transition-all cursor-pointer">
                    <div className="w-20 h-28 border-2 border-white/10 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a24]/95 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-around h-16">
            <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-white/40">
              <Home size={24} />
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
            <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-[#ff00ff]">
              <UserIcon size={24} />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

import { Home, Search, Sparkles, MessageCircle, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Post() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20 relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex items-center justify-center">
            <Plus size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Create Post</h1>
          <p className="text-white/60 mb-6">Share your fits and list items coming soon</p>
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#ff00ff]/50 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>

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
            <button className="flex flex-col items-center gap-1 text-[#ff00ff]">
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

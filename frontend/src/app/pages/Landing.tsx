import { Sparkles, Zap, Users, Instagram, Music } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function Landing() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock waitlist submission - in production, would call API
    alert(`Thanks for joining! We'll email you at ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2f] to-[#0a0a0f] overflow-hidden">
      {/* Animated gradient orbs in background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#9d00ff] rounded-full opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="text-4xl font-black tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #ff00ff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(255, 0, 255, 0.5)',
            }}
          >
            REVE
          </div>
          {/* <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            Enter App
          </button> */}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Logo */}
          <h1 
            className="text-8xl md:text-9xl font-black mb-8 tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #ff00ff, #9d00ff, #00d4ff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 60px rgba(255, 0, 255, 0.6))',
            }}
          >
            REVE
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-semibold">
            Your closet. Your campus. Your vibe.
          </p>
          <p className="text-lg text-white/60 mb-16 max-w-2xl mx-auto">
            The social fashion marketplace where college women share fits, discover looks, and borrow from each other's wardrobes.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto mb-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your .edu email"
                required
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[#ff00ff]/50 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #ff00ff, #9d00ff)',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
                }}
              >
                Join Waitlist
              </button>
            </form>
            <p className="text-sm text-white/50 mt-3">
              🎓 College-only access • Launching at top campuses
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-white/80">
            <div>
              <div className="text-3xl font-bold">2.5K+</div>
              <div className="text-sm text-white/50">On Waitlist</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-white/50">Campuses</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold">Coming</div>
              <div className="text-sm text-white/50">Spring 2026</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-md border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#ff00ff]/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex items-center justify-center">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Borrow from Your Campus</h3>
              <p className="text-white/60">
                Access fits from girls at your school. Trade, borrow, and share your wardrobe.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00d4ff]/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d00ff] flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Outfit Discovery</h3>
              <p className="text-white/60">
                Get personalized recommendations based on your style, vibe, and what's trending on campus.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00ffff]/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff] to-[#00d4ff] flex items-center justify-center">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build Your Digital Closet</h3>
              <p className="text-white/60">
                Post your fits, tag your items, and earn by sharing your closet with your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white/40 text-sm">
              © 2026 Reve • Made for college women, by college women
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff00ff] transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#00d4ff] transition-colors"
              >
                <Music size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

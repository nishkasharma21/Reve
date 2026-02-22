import { Sparkles } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-20 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinning logo */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" />
          
          {/* Inner glow circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 animate-pulse" />
          </div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        {/* REVE text */}
        <div className="text-center">
          <h1 
            className="text-4xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #ff00ff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            REVE
          </h1>
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-sm">Loading</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
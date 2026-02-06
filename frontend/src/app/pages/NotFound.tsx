import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex items-center justify-center">
            <AlertCircle size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-black text-white mb-3">404</h1>
          <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-white/60 mb-8">This page doesn't exist in the Reve universe</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#ff00ff]/50 transition-all"
          >
            Back to Landing
          </button>
        </div>
      </div>
    </div>
  );
}

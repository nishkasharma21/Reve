import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface OutfitCardProps {
  username: string;
  caption: string;
  likes: number;
  comments: number;
  taggedItems: string[];
}

export function OutfitCard({ username, caption, likes, comments, taggedItems }: OutfitCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden hover:border-[#ff00ff]/30 transition-all">
      {/* User header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] border border-white/20" />
        <span className="font-semibold text-white">{username}</span>
      </div>

      {/* Outfit image placeholder */}
      <div className="relative bg-[#0a0a0f] aspect-[3/4] flex items-center justify-center overflow-hidden group cursor-pointer">
        <div className="w-40 h-56 border-2 border-white/10 rounded-lg" />
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/0 to-[#00d4ff]/0 group-hover:from-[#ff00ff]/10 group-hover:to-[#00d4ff]/10 transition-all" />
        
        {/* Tagged items indicator */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
          <span className="text-sm font-medium text-white">
            🏷️ {taggedItems.length} items
          </span>
        </div>
      </div>

      {/* Actions and details */}
      <div className="p-4 space-y-4">
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <Heart
                size={24}
                fill={isLiked ? '#ff00ff' : 'none'}
                stroke={isLiked ? '#ff00ff' : '#fff'}
                className="transition-all"
              />
              <span className="text-sm text-white/80">
                {isLiked ? likes + 1 : likes}
              </span>
            </button>
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <MessageCircle size={24} stroke="#fff" />
              <span className="text-sm text-white/80">{comments}</span>
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="hover:opacity-70 transition-opacity"
          >
            <Bookmark
              size={24}
              fill={isSaved ? '#00d4ff' : 'none'}
              stroke={isSaved ? '#00d4ff' : '#fff'}
              className="transition-all"
            />
          </button>
        </div>

        {/* Caption */}
        <div>
          <p className="text-sm text-white">
            <span className="font-bold">{username}</span>{' '}
            <span className="text-white/80">{caption}</span>
          </p>
        </div>

        {/* Tagged items preview */}
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs text-white/40 mb-3">Tagged items:</p>
          <div className="flex gap-2 overflow-x-auto">
            {taggedItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 h-24 bg-[#0a0a0f] border border-white/10 rounded-lg hover:border-[#ff00ff]/50 transition-all cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

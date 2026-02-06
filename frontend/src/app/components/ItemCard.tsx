import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ItemCardProps {
  itemName: string;
  brand: string;
  size: string;
  category: string;
  price: string;
}

export function ItemCard({ itemName, brand, size, category, price }: ItemCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="group bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden hover:border-[#ff00ff]/50 transition-all cursor-pointer">
      {/* Image placeholder */}
      <div className="relative bg-[#0a0a0f] aspect-[3/4] flex items-center justify-center overflow-hidden">
        <div className="w-32 h-40 border-2 border-white/10 rounded-lg" />
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/0 to-[#00d4ff]/0 group-hover:from-[#ff00ff]/10 group-hover:to-[#00d4ff]/10 transition-all" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/70 transition-all"
        >
          <Heart
            size={20}
            fill={isSaved ? '#ff00ff' : 'none'}
            stroke={isSaved ? '#ff00ff' : '#fff'}
            className="transition-all"
          />
        </button>
      </div>

      {/* Item details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white mb-1">{itemName}</h3>
          <p className="text-sm text-white/60">{brand}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/50">
          <span>Size {size}</span>
          <span>•</span>
          <span>{category}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-[#00d4ff]">{price}</span>
          <button className="px-5 py-2 bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-[#ff00ff]/50 transition-all">
            Borrow
          </button>
        </div>
      </div>
    </div>
  );
}

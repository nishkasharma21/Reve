
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Loader2, Search, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { ClothingItem } from '../types';

interface Props {
  onComplete: (item: ClothingItem) => void;
}

const UploadPage: React.FC<Props> = ({ onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [productLink, setProductLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeItem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeItem = async (base64: string) => {
    setAnalyzing(true);
    try {
      const data = await gemini.analyzeListing(base64);
      setAnalysis(data);
      
      // Auto-trigger search for the product link
      setSearching(true);
      const link = await gemini.findProductLink(`${data.brand} ${data.title}`);
      setProductLink(link);
      setSearching(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFinish = () => {
    if (!analysis || !image) return;
    const newItem: ClothingItem = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: 'u1', // Default logged in user
      title: analysis.title,
      description: analysis.description,
      brand: analysis.brand,
      size: 'S', // Default/User input
      pricePerDay: analysis.suggestedPrice || 10,
      imageUrl: image,
      vibe: analysis.vibe || [],
      productLink: productLink || undefined,
      isAvailable: true,
      lenderRating: 5.0
    };
    onComplete(newItem);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black syne italic mb-2">ADD TO CLOSET</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest">AI Listing Assistant</p>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-3xl border-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-cyan-400/50 transition-all group"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera size={32} className="text-gray-400 group-hover:text-cyan-400" />
          </div>
          <div className="text-center">
            <p className="font-bold">Snap or Upload Fit</p>
            <p className="text-xs text-gray-500 mt-1">Our AI will handle the rest</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/10">
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
                <p className="font-bold syne tracking-widest text-sm text-cyan-400">ANALYZING VIBE...</p>
              </div>
            )}
          </div>

          {analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="glass-card p-6 rounded-3xl border-2 border-cyan-400/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400">AI Listing Generated</h3>
                </div>
                <h2 className="text-2xl font-bold mb-2">{analysis.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{analysis.description}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.vibe?.map((tag: string) => (
                    <span key={tag} className="bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border-2 border-pink-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search size={18} className="text-pink-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-pink-500">Reverse Search</h3>
                  </div>
                  {searching ? <Loader2 size={16} className="animate-spin text-pink-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                </div>
                {productLink ? (
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <LinkIcon size={20} className="text-gray-400" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Found Store Link</p>
                      <p className="text-xs truncate text-cyan-400 underline">{productLink}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Searching for original product page...</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Suggested Price</p>
                  <p className="text-xl font-black">${analysis.suggestedPrice || 10}/day</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Service Fee</p>
                  <p className="text-xl font-black text-green-400">7%</p>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-white text-black font-black italic rounded-3xl text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all"
              >
                LIST TO CAMPUS
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;

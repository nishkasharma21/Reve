
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Check } from 'lucide-react';

interface Props {
  chat: any;
  onBack: () => void;
}

const ChatDetailPage: React.FC<Props> = ({ chat, onBack }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Is your Edikted corset available for this Friday?", sender: 'other', time: '2:14 PM' },
    { id: 2, text: "Yes it is! I just got it dry cleaned too.", sender: 'me', time: '2:15 PM' },
    { id: 3, text: chat?.lastMsg || "When would be a good time to pick it up?", sender: 'other', time: '2:16 PM' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!msg.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: msg, 
      sender: 'me', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setMsg('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white pb-0">
      <header className="px-6 py-5 bg-black/80 backdrop-blur-3xl border-b border-white/5 flex items-center gap-4 fixed top-0 left-0 right-0 z-50">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <img src={chat?.avatar || 'https://picsum.photos/seed/user/100'} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
          <div>
            <h2 className="font-bold text-sm">{chat?.name || 'Jessica K.'}</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-24 pb-24 space-y-6 no-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-4 rounded-3xl ${
              m.sender === 'me' 
                ? 'bg-gradient-to-tr from-cyan-500 to-purple-500 text-white rounded-tr-none' 
                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              <div className={`flex items-center gap-1 mt-2 ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[9px] opacity-60 font-bold">{m.time}</span>
                {m.sender === 'me' && <Check size={10} className="opacity-60" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5">
        <div className="flex items-center gap-3">
          <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <ImageIcon size={20} className="text-gray-400" />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-cyan-400 transition-all text-sm font-medium"
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:scale-110 transition-transform active:scale-95 disabled:opacity-30"
              disabled={!msg.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPage;


import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface Props {
  onChatClick: (chat: any) => void;
}

const MessagesPage: React.FC<Props> = ({ onChatClick }) => {
  const chats = [
    { id: 1, name: 'Jessica K.', lastMsg: 'Is the top available for Friday?', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', status: 'unread' },
    { id: 2, name: 'Chloe Miller', lastMsg: 'I just dropped it off at the lounge!', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', status: 'read' },
    { id: 3, name: 'Sophia Chen', lastMsg: 'Omg it looked so cute on you!!', time: '5h ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', status: 'read' },
  ];

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black syne italic mb-2">MESSAGES</h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">Negotiate & Exchange</p>
      </header>

      <div className="relative mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search inbox..." 
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:border-cyan-400 transition-all text-sm font-medium"
        />
      </div>

      <div className="space-y-4">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => onChatClick(chat)}
            className="flex items-center gap-4 p-5 glass-card rounded-[2rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="relative">
              <img src={chat.avatar} className="w-16 h-16 rounded-[1.25rem] object-cover border border-white/10" alt={chat.name} />
              {chat.status === 'unread' && <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-tr from-pink-500 to-purple-500 border-4 border-black rounded-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm tracking-tight truncate">{chat.name}</h3>
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className={`text-xs truncate leading-relaxed ${chat.status === 'unread' ? 'text-white font-black' : 'text-gray-500'}`}>
                {chat.lastMsg}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 px-2">RENTAL TRACKER</h2>
        <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center">
          <p className="text-sm text-gray-400 mb-2 font-bold italic">No active borrowings.</p>
          <button className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">Find a Top Now</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

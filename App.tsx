
import React, { useState } from 'react';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  PlusSquare, 
  MessageCircle, 
  User as UserIcon
} from 'lucide-react';
import { View, User, ClothingItem } from './types';
import { MOCK_USER, MOCK_ITEMS } from './constants';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import MessagesPage from './pages/Messages';
import UploadPage from './pages/Upload';
import SearchPage from './pages/Search';
import ChatDetailPage from './pages/ChatDetail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ClothingItem[]>(MOCK_ITEMS);
  const [eduEmail, setEduEmail] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (eduEmail.endsWith('.edu')) {
      setUser(MOCK_USER);
      setCurrentView('home');
    } else {
      alert("Please use a valid .edu email to join the university network.");
    }
  };

  const openChat = (chat: any) => {
    setSelectedChat(chat);
    setCurrentView('chat-detail');
  };

  const renderView = () => {
    if (currentView === 'auth') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
          <div className="mb-12 text-center">
            <h1 className="text-8xl reve-bubble-text italic tracking-tighter mb-2 transform -skew-x-6">Rêve</h1>
            <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold">University Closet DNA</p>
          </div>
          
          <div className="w-full max-w-sm glass-card p-8 rounded-3xl border-2 border-white/10 shadow-[0_0_50px_rgba(162,255,255,0.1)]">
            <h2 className="text-2xl font-bold mb-6 text-center syne italic">Verify Campus</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">.edu Email Address</label>
                <input 
                  type="email" 
                  value={eduEmail}
                  onChange={(e) => setEduEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all text-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-black italic text-lg py-4 rounded-2xl hover:bg-cyan-300 hover:scale-[1.02] transition-all transform active:scale-95 shadow-xl"
              >
                JOIN THE CLOSET
              </button>
            </form>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home': return <HomePage items={items} />;
      case 'discover': return <SearchPage items={items} />;
      case 'profile': return <ProfilePage user={user!} items={items.filter(i => i.ownerId === user?.id)} />;
      case 'messages': return <MessagesPage onChatClick={openChat} />;
      case 'chat-detail': return <ChatDetailPage chat={selectedChat} onBack={() => setCurrentView('messages')} />;
      case 'upload': return <UploadPage onComplete={(newItem) => {
        setItems([newItem, ...items]);
        setCurrentView('profile');
      }} />;
      default: return <HomePage items={items} />;
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {renderView()}
      
      {currentView !== 'auth' && currentView !== 'chat-detail' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-8 py-5 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`transition-all ${currentView === 'home' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}>
            <HomeIcon size={26} strokeWidth={currentView === 'home' ? 3 : 2} />
          </button>
          <button onClick={() => setCurrentView('discover')} className={`transition-all ${currentView === 'discover' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}>
            <SearchIcon size={26} strokeWidth={currentView === 'discover' ? 3 : 2} />
          </button>
          <button 
            onClick={() => setCurrentView('upload')} 
            className="bg-gradient-to-tr from-pink-400 via-purple-500 to-cyan-300 p-4 rounded-full shadow-[0_0_30px_rgba(162,255,255,0.4)] transform -translate-y-8 border-4 border-black active:scale-90 transition-all"
          >
            <PlusSquare size={28} className="text-white" strokeWidth={3} />
          </button>
          <button onClick={() => setCurrentView('messages')} className={`transition-all ${currentView === 'messages' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}>
            <MessageCircle size={26} strokeWidth={currentView === 'messages' ? 3 : 2} />
          </button>
          <button onClick={() => setCurrentView('profile')} className={`transition-all ${currentView === 'profile' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}>
            <UserIcon size={26} strokeWidth={currentView === 'profile' ? 3 : 2} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;

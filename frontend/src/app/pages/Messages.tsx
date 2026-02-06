import { Send, Image, Smile, Clock, Home, Search, Sparkles, MessageCircle as MessageIcon, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Conversation {
  id: number;
  username: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  itemName: string;
  itemPrice: string;
}

export function Messages() {
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: 1,
      username: 'cyber_queen',
      lastMessage: 'Yes! When do you need it?',
      timestamp: '2m ago',
      unread: true,
      itemName: 'Chrome Mini Dress',
      itemPrice: '$12/day',
    },
    {
      id: 2,
      username: 'electric_girl',
      lastMessage: 'The boots are still available!',
      timestamp: '1h ago',
      unread: false,
      itemName: 'Platform Boots',
      itemPrice: '$14/day',
    },
    {
      id: 3,
      username: 'rave_bae',
      lastMessage: 'Thanks for borrowing! 💜',
      timestamp: '3h ago',
      unread: false,
      itemName: 'Holographic Skirt',
      itemPrice: '$10/day',
    },
    {
      id: 4,
      username: 'luna_vibe',
      lastMessage: 'Let me know if you need it longer',
      timestamp: '1d ago',
      unread: false,
      itemName: 'Neon Mesh Top',
      itemPrice: '$8/day',
    },
  ];

  const messages = [
    { id: 1, sender: 'other', text: 'Hey! Is the Chrome Mini Dress available this weekend?', time: '2:34 PM' },
    { id: 2, sender: 'me', text: 'Yes it is! Which days were you thinking?', time: '2:35 PM' },
    { id: 3, sender: 'other', text: 'Friday and Saturday? I have a rave at the Shrine 🎪', time: '2:36 PM' },
    { id: 4, sender: 'me', text: 'Perfect! That works for me', time: '2:37 PM' },
    { id: 5, sender: 'other', text: 'Yes! When do you need it?', time: '2:38 PM' },
  ];

  const activeConvo = conversations.find(c => c.id === activeConversation);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Mock send message
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20 relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff00ff] rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="bg-[#1a1a24]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white">Messages</h1>
            <button
              onClick={() => navigate('/')}
              className="text-3xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ff00ff, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              REVE
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-[#1a1a24]/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff00ff]/50 transition-all"
              />
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setActiveConversation(convo.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-all border-b border-white/5 ${
                    activeConversation === convo.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex-shrink-0" />
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{convo.username}</span>
                      <span className="text-xs text-white/40">{convo.timestamp}</span>
                    </div>
                    <p className="text-sm text-white/60 truncate mb-1">{convo.lastMessage}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-8 bg-[#0a0a0f] border border-white/10 rounded" />
                      <span className="text-xs text-white/40">{convo.itemName}</span>
                    </div>
                  </div>
                  {convo.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#ff00ff] flex-shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          {activeConvo ? (
            <div className="lg:col-span-2 bg-[#1a1a24]/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              {/* Chat Header with Item Context */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff]" />
                  <div>
                    <h3 className="font-bold text-white">{activeConvo.username}</h3>
                    <p className="text-sm text-white/40">Active now</p>
                  </div>
                </div>

                {/* Pinned Item Context Card */}
                <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#ff00ff]/10 to-[#00d4ff]/10 border border-[#ff00ff]/20 rounded-xl">
                  <div className="w-16 h-20 bg-[#0a0a0f] border border-white/10 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{activeConvo.itemName}</h4>
                    <p className="text-sm text-white/60 mb-2">Available to borrow</p>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#00d4ff]">{activeConvo.itemPrice}</span>
                      <button className="px-4 py-1.5 bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-[#ff00ff]/50 transition-all">
                        <Clock size={14} className="inline mr-1" />
                        Request Dates
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          msg.sender === 'me'
                            ? 'bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="text-xs text-white/40 mt-1 px-1">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              <div className="px-6 py-3 border-t border-white/10">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all whitespace-nowrap">
                    When can I pick it up?
                  </button>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all whitespace-nowrap">
                    Is it still available?
                  </button>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all whitespace-nowrap">
                    Can I extend the rental?
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Image size={24} />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Smile size={24} />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff00ff]/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-[#ff00ff] to-[#9d00ff] rounded-xl hover:shadow-lg hover:shadow-[#ff00ff]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-[#1a1a24]/50 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white/40">
                <MessageIcon size={64} className="mx-auto mb-4" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </main>

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
            <button className="flex flex-col items-center gap-1 text-white/40">
              <div className="w-12 h-12 -mt-2 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#9d00ff] flex items-center justify-center shadow-lg shadow-[#ff00ff]/50">
                <Sparkles size={24} className="text-white" />
              </div>
            </button>
            <button onClick={() => navigate('/messages')} className="flex flex-col items-center gap-1 text-[#ff00ff]">
              <MessageIcon size={24} />
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

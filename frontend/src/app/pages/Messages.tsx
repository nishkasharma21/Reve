import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { mockConversations, mockMessages, CURRENT_USER_ID, Message } from "../data/mockMessages";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Messages() {
  const { conversationId } = useParams();
  const [conversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(
    conversationId || conversations[0]?.id
  );
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    const otherParticipantName = currentConversation.participantNames.find(
      (name) => name !== "You"
    );
    const otherParticipantId = currentConversation.participantIds.find(
      (id) => id !== CURRENT_USER_ID
    );

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: CURRENT_USER_ID,
      senderName: "You",
      receiverId: otherParticipantId || "",
      receiverName: otherParticipantName || "",
      content: newMessage,
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message],
    }));
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm hover:underline mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participantNames.find(
                  (name) => name !== "You"
                );
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={conversation.itemImage}
                        alt={conversation.itemName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm truncate">
                            {otherParticipant}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2">{conversation.unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {conversation.itemName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(conversation.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Thread */}
          <div className="col-span-2 flex flex-col">
            {currentConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentConversation.itemImage}
                      alt={currentConversation.itemName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="font-semibold">
                        {currentConversation.participantNames.find((name) => name !== "You")}
                      </h2>
                      <Link
                        to={`/item/${currentConversation.itemId}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {currentConversation.itemName}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((message) => {
                    const isCurrentUser = message.senderId === CURRENT_USER_ID;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 bg-gray-50"
                >
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send size={18} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Coordinate pickup and return times, locations, and any questions
                    about the item
                  </p>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  itemId: string;
  itemName: string;
  itemImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Mock current user ID
export const CURRENT_USER_ID = "current-user";
export const CURRENT_USER_NAME = "You";

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantIds: [CURRENT_USER_ID, "user-sarah"],
    participantNames: [CURRENT_USER_NAME, "Sarah M."],
    itemId: "1",
    itemName: "Black Mini Dress",
    itemImage: "https://images.unsplash.com/photo-1764179690227-af049306cd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjB3b21hbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE3MTE5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Sure! How about tomorrow at 2pm near the library?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unreadCount: 2,
  },
  {
    id: "conv-2",
    participantIds: [CURRENT_USER_ID, "user-emma"],
    participantNames: [CURRENT_USER_NAME, "Emma K."],
    itemId: "2",
    itemName: "White Crop Top",
    itemImage: "https://images.unsplash.com/photo-1724490056260-44bf1de2617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwdG9wJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE2NTQyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Great! See you then!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participantIds: [CURRENT_USER_ID, "user-olivia"],
    participantNames: [CURRENT_USER_NAME, "Olivia R."],
    itemId: "4",
    itemName: "Leather Jacket",
    itemImage: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE2MTg0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Yes, I'm available! What dates were you thinking?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
  },
];

// Mock messages for conversations
export const mockMessages: { [key: string]: Message[] } = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      receiverId: "user-sarah",
      receiverName: "Sarah M.",
      content: "Hi! I'm interested in renting your black mini dress for next weekend. Is it still available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "user-sarah",
      senderName: "Sarah M.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "Yes, it's available! When would you like to pick it up?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      receiverId: "user-sarah",
      receiverName: "Sarah M.",
      content: "Would tomorrow work? Maybe somewhere on campus?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true,
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "user-sarah",
      senderName: "Sarah M.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "Sure! How about tomorrow at 2pm near the library?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "msg-5",
      conversationId: "conv-1",
      senderId: "user-sarah",
      senderName: "Sarah M.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "I can meet at the main entrance!",
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
      read: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      conversationId: "conv-2",
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      receiverId: "user-emma",
      receiverName: "Emma K.",
      content: "Hey! Can I rent your white crop top for this Friday?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
    },
    {
      id: "msg-7",
      conversationId: "conv-2",
      senderId: "user-emma",
      senderName: "Emma K.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "Absolutely! When's good for pickup?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: "msg-8",
      conversationId: "conv-2",
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      receiverId: "user-emma",
      receiverName: "Emma K.",
      content: "Thursday after 3pm? I can meet you at the student center.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      read: true,
    },
    {
      id: "msg-9",
      conversationId: "conv-2",
      senderId: "user-emma",
      senderName: "Emma K.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "Great! See you then!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-10",
      conversationId: "conv-3",
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      receiverId: "user-olivia",
      receiverName: "Olivia R.",
      content: "Hi Olivia! I love your leather jacket. Is it available for rent in March?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      read: true,
    },
    {
      id: "msg-11",
      conversationId: "conv-3",
      senderId: "user-olivia",
      senderName: "Olivia R.",
      receiverId: CURRENT_USER_ID,
      receiverName: CURRENT_USER_NAME,
      content: "Yes, I'm available! What dates were you thinking?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: false,
    },
  ],
};

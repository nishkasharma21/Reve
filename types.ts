
export interface User {
  id: string;
  name: string;
  handle: string;
  email: string; // must end in .edu
  university: string;
  bio: string;
  avatar: string;
  rating: number; // Dual rating
  borrowsRemaining: number;
}

export interface ClothingItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  brand: string;
  size: string;
  pricePerDay: number;
  imageUrl: string;
  vibe: string[];
  productLink?: string;
  isAvailable: boolean;
  lenderRating: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  taggedItems: string[]; // IDs of ClothingItem
  likes: number;
  comments: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  itemId?: string;
}

export type View = 'home' | 'discover' | 'upload' | 'messages' | 'profile' | 'auth' | 'chat-detail';

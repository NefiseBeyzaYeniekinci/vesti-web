export interface MessageUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  participants: MessageUser[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

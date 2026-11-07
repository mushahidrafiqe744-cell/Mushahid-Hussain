export interface ChatAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'owner';
  senderName: string;
  text: string;
  timestamp: string;
  timeFormatted: string;
  read: boolean;
  attachment?: ChatAttachment;
}

export interface ChatConversation {
  id: string; // sessionId
  clientName: string;
  clientEmail: string;
  clientDevice: string;
  clientIp: string;
  createdAt: string;
  updatedAt: string;
  clientOnline: boolean;
  ownerTyping: boolean;
  clientTyping: boolean;
  unreadByOwner: number;
  unreadByClient: number;
  messages: ChatMessage[];
}

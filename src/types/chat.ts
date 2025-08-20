// src/types/chat.ts
export interface Message {
  id: number;
  roomId: number;
  senderId: String;
  senderNickname: string;
  senderEmail: String;
  content: string;
  timestamp: Date;
  isMine: boolean;
}

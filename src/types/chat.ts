// src/types/chat.ts
export interface Message {
  id: number;
  senderNickname: string;
  content: string;
  timestamp: Date;
  isMine: boolean;
}

// src/types/chat.ts
export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isMine: boolean;
}

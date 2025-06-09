"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { Message } from "@/types/chat";

interface ChatContextType {
  roomId: string;
  title: string;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const { data: room } = await api.get(
          `/chat-service/api/v1/rooms/title/${encodeURIComponent(title)}`
        );
        setRoomId(room.id.toString());

        const userEmail = localStorage.getItem("user_email");

        const historyRes = await api.get(
          `/chat-service/api/v1/chat/history/${room.id}`
        );

        const converted = historyRes.data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isMine: msg.isMine,
        }));

        setMessages(converted);
      } catch (err) {
        console.error("❌ 채팅 초기화 실패:", err);
      }
    };
    init();
  }, [title]);

  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    const payload = {
      roomId: Number(roomId),
      sender: localStorage.getItem("user_email") || "나",
      content: input,
    };

    try {
      await api.post("/chat-service/api/v1/chat/send", payload);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(), // 임시 ID
          sender: payload.sender,
          content: payload.content,
          timestamp: new Date(),
          isMine: true,
        },
      ]);

      setInput("");
    } catch (err) {
      console.error("❌ 메시지 전송 실패:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{ roomId, title, messages, input, setInput, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("ChatContext 오류: ChatProvider 내부에서 사용해야 함");
  return ctx;
};

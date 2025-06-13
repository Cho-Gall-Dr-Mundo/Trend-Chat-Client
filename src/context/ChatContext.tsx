"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import api from "@/lib/api";
import { Message } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";

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
  children: ReactNode;
}) => {
  const { user } = useAuth();

  if (!user || !user.nickname) {
    console.warn("⛔ 유저 정보 없음 (nickname 누락) → ChatProvider 렌더 중단");
    return null;
  }

  const nickname = user.nickname.trim().toLowerCase();
  const [roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const eventSource = useRef<EventSource | null>(null);

  // 1️⃣ 채팅방 및 과거 메시지 로드
  useEffect(() => {
    if (!nickname) return;

    const init = async () => {
      try {
        const { data: room } = await api.get(
          `/chat-service/api/v1/rooms/title/${encodeURIComponent(title)}`
        );
        setRoomId(String(room.id));

        const historyRes = await api.get(
          `/chat-service/api/v1/chat/history/${room.id}`
        );

        console.log("📦 전체 history 응답:", historyRes.data);

        const converted = historyRes.data.map((msg: any) => {
          const isMine = msg.senderNickname?.trim().toLowerCase() === nickname;

          console.log("🕘 [HISTORY]", {
            raw: msg,
            senderNickname: msg.senderNickname,
            myNickname: nickname,
            isMine,
          });

          return {
            id: msg.id,
            roomId: msg.roomId,
            senderNickname: msg.senderNickname, // ✅ 명시적으로 포함
            senderEmail: msg.senderEmail, // 혹시 프론트에서 표시 필요하면
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            isMine,
          };
        });

        setMessages(converted);
      } catch (err) {
        console.error("❌ 채팅 초기화 실패:", err);
      }
    };

    init();
  }, [title, nickname]);

  // 2️⃣ SSE 실시간 수신
  useEffect(() => {
    if (!roomId || !nickname) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-service/api/v1/chat/stream`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 60000,
      }
    );

    es.onopen = () => console.log("✅ SSE 연결됨");

    es.onmessage = (event: MessageEvent) => {
      const msg: Message = JSON.parse(event.data);

      // ✅ ping 무시
      if (msg.content === "ping") return;

      const isMine = msg.senderNickname?.trim().toLowerCase() === nickname;

      console.log("📥 [SSE]", {
        raw: msg,
        senderNickname: msg.senderNickname,
        myNickname: nickname,
        isMine,
      });

      const enrichedMsg: Message = {
        id: msg.id,
        roomId: msg.roomId,
        senderNickname: msg.senderNickname, // ✅ 명시
        senderEmail: msg.senderEmail,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isMine,
      };

      if (String(msg.roomId) === String(roomId)) {
        setMessages((prev) => [...prev, enrichedMsg]);
      }
    };

    es.onerror = (err: Event) => {
      console.error("❌ SSE 연결 오류:", err);
      es.close();
    };

    eventSource.current = es;
    return () => es.close();
  }, [roomId, nickname]);

  // 3️⃣ 메시지 전송 함수
  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    const payload = {
      roomId: Number(roomId),
      senderNickname: user.nickname, // 그대로 보냄
      content: input,
    };

    try {
      await api.post("/chat-service/api/v1/chat/send", payload);
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
  if (!ctx) {
    throw new Error("useChat은 ChatProvider 내부에서만 사용해야 합니다");
  }
  return ctx;
};

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

interface Participant {
  id: string;
  nickname: string;
}

interface ChatContextType {
  roomId: string;
  title: string;
  description: string;
  messages: Message[];
  participants: string[];
  nicknameMap: Record<string, string>;
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
  const nickname = user?.nickname?.trim().toLowerCase() || "";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const eventSource = useRef<EventSource | null>(null);
  const joinOnce = useRef(false);

  const [roomId, setRoomId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!nickname || joinOnce.current) return;

    joinOnce.current = true;

    const init = async () => {
      try {
        const { data: room } = await api.get(
          `/chat-service/api/v1/rooms/title/${encodeURIComponent(title)}`
        );
        setRoomId(String(room.id));
        setDescription(room.description || "");

        await new Promise((r) => setTimeout(r, 100));

        try {
          await api.post(`/chat-service/api/v1/rooms/${room.id}/members`);
        } catch (err: any) {
          if (err.response?.status === 403) {
            const message = err.response?.data;
            if (
              typeof message === "string" &&
              message.includes("최대 5개의 채팅방")
            ) {
              alert("⚠️ 무료 유저는 최대 5개의 채팅방만 구독할 수 있어요.");
            } else {
              alert("⚠️ 채팅방에 참가할 수 없습니다.");
            }
            return;
          }
        }

        const membersRes = await api.get(
          `/chat-service/api/v1/rooms/${room.id}/members`
        );
        const members: Participant[] = membersRes.data;
        setParticipants(members.map((m) => m.nickname));
        setNicknameMap(
          Object.fromEntries(members.map((m) => [m.id, m.nickname]))
        );

        const historyRes = await api.get(
          `/chat-service/api/v1/chat/history/${room.id}`
        );
        const converted = historyRes.data.map((msg: any) => ({
          id: msg.id,
          roomId: msg.roomId,
          senderNickname: msg.senderNickname,
          senderEmail: msg.senderEmail,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isMine: msg.senderNickname?.trim().toLowerCase() === nickname,
        }));
        setMessages(converted);

        setIsInitializing(false);
      } catch (err: any) {
        console.error("❌ 채팅방 초기화 실패:", err);
      }
    };

    init();
  }, [title, nickname]);

  useEffect(() => {
    if (!roomId || !nickname) return;

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
      if (msg.content === "ping") return;

      const isMine = msg.senderNickname?.trim().toLowerCase() === nickname;
      const enriched: Message = {
        id: msg.id,
        roomId: msg.roomId,
        senderNickname: msg.senderNickname,
        senderEmail: msg.senderEmail,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isMine,
      };

      if (String(msg.roomId) === String(roomId)) {
        setMessages((prev) => [...prev, enriched]);
      }
    };

    es.onerror = (err: unknown) => {
      console.error("❌ SSE 오류:", err);
      es.close();
    };

    eventSource.current = es;
    return () => es.close();
  }, [roomId, nickname]);

  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    const payload = {
      roomId: Number(roomId),
      senderNickname: user?.nickname,
      content: input,
    };

    try {
      await api.post("/chat-service/api/v1/chat/send", payload);
      setInput("");
    } catch (err) {
      console.error("❌ 메시지 전송 실패:", err);
    }
  };

  if (!user || !user.nickname) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (isInitializing) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        roomId,
        title,
        description,
        messages,
        participants,
        nicknameMap,
        input,
        setInput,
        sendMessage,
      }}
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

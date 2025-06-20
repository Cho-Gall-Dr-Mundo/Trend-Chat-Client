"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";

interface ChatRoomStat {
  roomId: number;
  title: string;
  participants: number;
  messages: number;
}

interface RawRoom {
  id: number;
  title: string;
  description?: string;
}

interface ChatStatContextType {
  rooms: ChatRoomStat[]; // 🔥 트렌드 top6
  allRooms: RawRoom[]; // ✅ 전체 채팅방 목록
  loading: boolean;
}

const ChatStatContext = createContext<ChatStatContextType | null>(null);

export const ChatStatProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<ChatRoomStat[]>([]);
  const [allRooms, setAllRooms] = useState<RawRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrends = async () => {
    try {
      const { data: topIds } = await api.get<number[]>(
        "/chat-service/api/v1/rooms/stats/top5"
      );
      console.log("✅ top5 room ids:", topIds);

      const { data: all } = await api.get<RawRoom[]>(
        "/chat-service/api/v1/rooms"
      );
      console.log("✅ allRooms:", all);
      setAllRooms(all); // ✅ 전체 채팅방 저장

      const { data: stats } = await api.post<
        Record<number, { participants: number; messageCount: number }>
      >("/chat-service/api/v1/rooms/stats/bulk", topIds);
      console.log("✅ bulk stats:", stats);

      const trendRooms: ChatRoomStat[] = topIds.map((id) => {
        const meta = all.find((r) => r.id === id);
        const stat = stats[id];
        return {
          roomId: id,
          title: meta?.title ?? "알 수 없음",
          participants: stat?.participants ?? 0,
          messages: stat?.messageCount ?? 0,
        };
      });

      console.log("🔥 trendRooms 최종:", trendRooms);
      setRooms(trendRooms);
      setLoading(false);
    } catch (err) {
      console.error("❌ 트렌드 통계 로딩 실패:", err);
    }
  };

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(() => fetchTrends(), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChatStatContext.Provider value={{ rooms, allRooms, loading }}>
      {children}
    </ChatStatContext.Provider>
  );
};

export const useTrendRooms = () => {
  const ctx = useContext(ChatStatContext);
  if (!ctx)
    throw new Error(
      "useTrendRooms는 ChatStatProvider 내부에서만 사용 가능합니다."
    );
  return ctx;
};

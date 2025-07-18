"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { RoomSummaryEvent } from "@/types/RoomSummaryType";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useChat } from "@/context/ChatContext"; // ✅ ChatContext에서 roomId 가져옴

// 컨텍스트 값 타입
interface SummarySSEContextValue {
  newRooms: Set<number>;
  clearNewRoom: (roomId: number) => void;
}

// 컨텍스트 생성
const SummarySSEContext = createContext<SummarySSEContextValue | undefined>(
  undefined
);

// Provider 컴포넌트
export function SummarySSEProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roomId: currentRoomId } = useChat(); // ✅ 컴포넌트 함수 최상단에서 호출

  const [newRooms, setNewRooms] = useState<Set<number>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-service/api/v1/rooms/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 60000,
        withCredentials: true,
      }
    );

    eventSource.onmessage = (e: MessageEvent) => {
      try {
        const data: RoomSummaryEvent = JSON.parse(e.data);

        // ✅ 현재 열려 있는 방이면 NEW 안 뜨게
        if (String(data.roomId) === String(currentRoomId)) return;

        setNewRooms((prev) => new Set(prev).add(data.roomId));
      } catch (err) {
        console.error("❌ SSE 메시지 파싱 실패:", err);
      }
    };

    eventSource.onerror = (err: MessageEvent) => {
      console.error("❌ SSE 연결 에러:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [currentRoomId]); // ✅ 의존성으로 넣기

  const clearNewRoom = (roomId: number) => {
    setNewRooms((prev) => {
      const updated = new Set(prev);
      updated.delete(roomId);
      return updated;
    });
  };

  return (
    <SummarySSEContext.Provider value={{ newRooms, clearNewRoom }}>
      {children}
    </SummarySSEContext.Provider>
  );
}

// 커스텀 훅
export function useSummarySSE(): SummarySSEContextValue {
  const ctx = useContext(SummarySSEContext);
  if (!ctx)
    throw new Error("useSummarySSE must be used within SummarySSEProvider");
  return ctx;
}

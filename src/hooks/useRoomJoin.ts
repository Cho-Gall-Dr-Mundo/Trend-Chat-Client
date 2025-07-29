// hooks/useRoomJoin.ts
"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api";

export const useRoomJoin = () => {
  const router = useRouter();

  const handleRoomClick = async (roomId: number, title: string) => {
    try {
      await api.post(`/chat-service/api/v1/rooms/${roomId}/members`);
      router.push(`/chat/${encodeURIComponent(title)}`);
    } catch (err: any) {
      if (err.response?.status === 403) {
        const message = err.response?.data;
        if (
          typeof message === "string" &&
          message.includes("최대 5개의 채팅방")
        ) {
          alert("⚠️ 무료 유저는 최대 5개의 채팅방만 구독할 수 있어요.");
          return;
        }
        alert("⚠️ 무료 유저는 최대 5개의 채팅방만 구독할 수 있어요.");
      } else {
        console.error("❌ 방 참가 중 에러:", err);
        alert("⚠️ 채팅방 입장에 실패했습니다.");
      }
    }
  };

  return { handleRoomClick };
};

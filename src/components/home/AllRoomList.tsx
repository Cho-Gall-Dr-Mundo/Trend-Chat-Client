// components/home/AllRoomList.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface ChatRoom {
  id: number;
  title: string;
  description?: string;
}

interface AllRoomListProps {
  onRoomClick: (title: string) => void;
}

const AllRoomList: React.FC<AllRoomListProps> = ({ onRoomClick }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get<ChatRoom[]>(
          "/chat-service/api/v1/rooms"
        );
        setRooms(data);
      } catch (err) {
        console.error("❌ 전체 채팅방 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return null;

  return (
    <section className="mt-20 w-full flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          💬 전체 채팅방
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in delay-500">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-4 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md"
              onClick={() => onRoomClick(room.title)}
            >
              <div className="text-white font-semibold text-lg mb-1">
                #{room.title}
              </div>
              <div className="text-sm text-zinc-400">
                📝 {room.description || "설명 없음"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllRoomList;

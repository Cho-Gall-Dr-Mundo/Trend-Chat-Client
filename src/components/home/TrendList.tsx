"use client";

import React from "react";
import { useTrendRooms } from "@/context/ChatStatContext";
import { useRoomJoin } from "@/hooks/useRoomJoin";

const TrendList: React.FC = () => {
  const { rooms, loading } = useTrendRooms();
  const { handleRoomClick } = useRoomJoin();

  if (loading) return null;

  return (
    <section className="mt-20 w-full flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🔥 실시간 인기 채팅방
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in delay-500">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-4 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md"
              onClick={() => handleRoomClick(room.roomId, room.title)}
            >
              <div className="text-white font-semibold text-lg mb-1">
                #{room.title}
              </div>
              <div className="text-sm text-zinc-400">
                👥 {room.participants}명 참여 중
                <br />
                💬 {room.messages}건 대화 진행
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendList;

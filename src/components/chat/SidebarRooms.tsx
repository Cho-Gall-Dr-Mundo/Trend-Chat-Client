"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/lib/api"; // 커스텀 axios 인스턴스

export interface MyRoomResponse {
  id: number;
  title: string;
  memberCount: number;
}

export default function SidebarRooms() {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<MyRoomResponse[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/chat-service/api/v1/rooms/my");
        setRooms(res.data);
      } catch (error) {
        console.error("❌ 채팅방 목록 불러오기 실패:", error);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="relative w-full lg:w-1/5 border-t lg:border-t-0 lg:border-l border-zinc-700 bg-zinc-900/30 backdrop-blur-md p-4 text-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 blur-[100px] opacity-20 z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500 blur-[100px] opacity-20 z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="font-semibold text-zinc-300 mb-2">채팅방</div>

        <input
          type="text"
          placeholder="🔍 채팅방 검색..."
          className="mb-3 w-full rounded-md bg-zinc-700/40 text-white text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-zinc-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul
          className="space-y-3 max-h-[500px] overflow-y-auto pr-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            ul::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {filteredRooms.map((room, index) => (
            <motion.li
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex justify-between items-center p-2 bg-zinc-800/60 rounded-lg cursor-pointer hover:bg-purple-600/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-transform will-change-transform"
              onClick={() => (window.location.href = `/chat/${room.title}`)}
            >
              <div>
                <div className="font-semibold text-white text-sm">
                  #{room.title}
                </div>
                <div className="text-xs text-zinc-400">
                  {room.memberCount}명 참여 중
                </div>
              </div>
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                {index + 1} new
              </span>
            </motion.li>
          ))}

          {filteredRooms.length === 0 && (
            <div className="text-zinc-400 text-xs text-center py-4">
              검색 결과가 없습니다.
            </div>
          )}
        </ul>
      </div>
    </aside>
  );
}

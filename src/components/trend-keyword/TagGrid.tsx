"use client";

import React from "react";
import { useTrendRooms } from "@/context/ChatStatContext";

interface TagGridProps {
  search: string;
}

const TagGrid: React.FC<TagGridProps> = ({ search }) => {
  const { allRooms } = useTrendRooms();

  if (!search) return null; // ✅ 검색어 없으면 아예 렌더링 안 함

  const filteredTags = allRooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredTags.length === 0) {
    return (
      <p className="text-zinc-400 mt-6 text-center animate-fade-in">
        '{search}'에 대한 키워드가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 animate-fade-in">
      {filteredTags.map((room) => (
        <div
          key={room.id}
          className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-4 border border-zinc-700 shadow-md backdrop-blur-md"
        >
          <div className="text-white font-semibold text-lg mb-1">
            #{room.title}
          </div>
          <div className="text-sm text-zinc-400">자동 생성된 채팅방입니다.</div>
        </div>
      ))}
    </div>
  );
};

export default TagGrid;

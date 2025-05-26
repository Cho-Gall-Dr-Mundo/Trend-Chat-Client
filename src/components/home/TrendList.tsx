"use client";

import React from "react";

interface TrendRoom {
  topic: string;
  participants: number;
  messages: number;
}

interface TrendListProps {
  onTrendClick: (trend: string) => void;
}

const mockRooms: TrendRoom[] = [
  { topic: "AI 논쟁", participants: 58, messages: 124 },
  { topic: "웹3.0", participants: 43, messages: 98 },
  { topic: "우크라 전황", participants: 32, messages: 71 },
  { topic: "NFT 붕괴", participants: 21, messages: 55 },
  { topic: "오픈AI 개편", participants: 19, messages: 49 },
  { topic: "네카라쿠배퇴사", participants: 77, messages: 190 },
];

const TrendList: React.FC<TrendListProps> = ({ onTrendClick }) => {
  return (
    <section className="mt-20 w-full flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🔥 실시간 인기 채팅방
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in delay-500">
          {mockRooms.map((room, index) => (
            <div
              key={index}
              className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-4 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md"
              onClick={() => onTrendClick(room.topic)}
            >
              <div className="text-white font-semibold text-lg mb-1">
                #{room.topic}
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

"use client";

import React from "react";
import { format } from "date-fns";

const HeroPreview: React.FC = () => {
  const now = new Date();
  return (
    <div className="w-full h-64 bg-zinc-800/50 rounded-xl border border-zinc-700 p-4 flex flex-col gap-3 overflow-hidden text-sm">
      {/* 트렌드 헤더 */}
      <div className="text-white font-semibold text-sm mb-1">
        🔥 트렌드: <span className="text-purple-300">AI 논쟁</span>
      </div>

      {/* 채팅 메시지 예시 */}
      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-[10px] font-bold">
          초
        </div>
        <div className="p-2 rounded-lg max-w-[75%] text-white backdrop-blur-md bg-white/10 border border-white/10">
          <span className="text-[10px] font-semibold text-purple-200 block mb-1">
            김초 · {format(now, "HH:mm")}
          </span>
          <div className="break-words">요즘 트렌드 뭐야?🔥</div>
        </div>
      </div>

      <div className="flex items-end gap-2 justify-start">
        <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-[10px] font-bold">
          갈
        </div>
        <div className="p-2 rounded-lg max-w-[75%] text-white backdrop-blur-md bg-white/10 border border-white/10">
          <span className="text-[10px] font-semibold text-purple-200 block mb-1">
            이갈 · {format(now, "HH:mm")}
          </span>
          <div className="break-words">방금 올라온 이슈 봤어? ㄹㅇ 대박임.</div>
        </div>
      </div>

      <div className="flex items-end gap-2 justify-end">
        <div className="p-2 rounded-lg max-w-[75%] text-white backdrop-blur-md bg-purple-600">
          <span className="text-[10px] font-semibold text-purple-200 block mb-1">
            나 · {format(now, "HH:mm")}
          </span>
          <div className="break-words">헉 진짜? 공유해줘!</div>
        </div>
        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold">
          나
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;
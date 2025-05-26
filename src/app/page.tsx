// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const mockTrends = [
  "AI 논쟁",
  "웹3.0",
  "우크라 전황",
  "NFT 붕괴",
  "오픈AI 개편",
  "네카라쿠배퇴사",
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white overflow-hidden">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-6 py-2 h-20 border-b border-zinc-700 backdrop-blur-md bg-zinc-900/50 z-20">
        <img
          src="/trendchat-logo.png"
          alt="Trend Chat Logo"
          className="h-full max-h-16 animate-glow-slow drop-shadow-[0_0_12px_rgba(59,130,246,0.95)]"
        />
        <Button
          onClick={() => router.push("/chat")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          채팅 참여
        </Button>
      </header>

      {/* 히어로 섹션 */}
      <main className="flex-1 flex flex-col items-center justify-center px-10 py-12 relative z-10">
        {/* 배경 이펙트 */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 blur-[160px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 blur-[200px] opacity-20 animate-ping" />

        <h2
          className="text-5xl font-extrabold tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse"
          style={{ animationDuration: "2s" }}
        >
          🔥 Trend Chat
        </h2>
        <p className="mt-2 text-2xl font-semibold text-white animate-fade-in delay-150">
          실시간 트렌드 채팅
        </p>

        {/* 트렌드 키워드 목록 */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl animate-fade-in delay-500">
          {mockTrends.map((trend, index) => (
            <div
              key={index}
              className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-4 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md"
              onClick={() => router.push(`/chat/${encodeURIComponent(trend)}`)}
            >
              <div className="text-white font-semibold text-lg">#{trend}</div>
              <div className="text-sm text-zinc-400 mt-1">
                지금 참여해보세요
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="text-center py-4 text-zinc-500 text-sm border-t border-zinc-700 bg-zinc-900/40 backdrop-blur-md z-20">
        © 2025 Trend Chat. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroPreview from "@/components/home/HeroPreview";

const Hero: React.FC = () => {
  const router = useRouter();

  // 로그인 여부 판별 함수 (access_token 기준)
  const isLoggedIn = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      return !!token; // 있으면 true
    }
    return false;
  };

  // 버튼 클릭 시 이동 로직
  const handleButtonClick = () => {
    if (isLoggedIn()) {
      router.push("/trend-keyword");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative z-10 px-8 py-20 w-full bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900">
      {/* 배경 블러 효과 */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 blur-[160px] opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 blur-[200px] opacity-20 animate-ping" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* 왼쪽 텍스트 영역 */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            🔥 Trend Chat
          </h1>
          <p className="mt-4 text-xl text-zinc-300 font-medium">
            SNS에서 수집한 트렌드로
            <br className="hidden md:block" /> 실시간 채팅방을 자동 생성합니다.
          </p>
          <button
            onClick={handleButtonClick}
            className="mt-6 px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-semibold"
          >
            지금 참여하기
          </button>
        </div>

        {/* 오른쪽 프리뷰 */}
        <div className="flex-1 hidden md:block">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ClosingSection: React.FC = () => {
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
    <section className="relative mt-28 mb-32 w-full px-6 py-20 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-t border-zinc-800 flex justify-center overflow-hidden">
      {/* 배경 블러 이펙트 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 blur-[160px] opacity-10 animate-ping" />

      <div className="relative z-10 w-full max-w-4xl text-center p-10 rounded-2xl border border-zinc-700 bg-zinc-900/70 shadow-2xl backdrop-blur-md">
        <blockquote className="text-zinc-300 italic text-lg md:text-xl mb-6 leading-relaxed">
          “처음엔 키워드가 궁금했어요. 나중엔 사람들이 궁금해졌어요.”
        </blockquote>
        <p className="text-zinc-500 text-sm mb-8">
          — Trend Chat 개발자 초갈 & 문도
        </p>

        <div className="text-white font-semibold text-2xl mb-3">
          우리는 대화의 흐름을 믿습니다.
        </div>
        <p className="text-zinc-400 text-base md:text-lg mb-8">
          트렌드 키워드를 따라가다 보면,
          <br className="hidden sm:inline" />
          결국 사람과 생각을 만나게 됩니다.
        </p>

        <button
          onClick={handleButtonClick}
          className="mt-6 px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-semibold"
        >
          지금 참여하기
        </button>
      </div>
    </section>
  );
};

export default ClosingSection;

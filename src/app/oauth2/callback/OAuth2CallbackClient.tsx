"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuth2Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      const raw = token.startsWith("Bearer ") ? token.substring(7) : token;
      localStorage.setItem("access_token", raw);
      router.replace("/");
    } else {
      alert("토큰이 없습니다. 다시 로그인해주세요.");
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#16063b] via-[#1d164a] to-[#341473] relative overflow-hidden">
      {/* 블러 라이트 효과 */}
      <div className="absolute top-[-10%] left-[-15%] w-[360px] h-[320px] rounded-full bg-fuchsia-700/20 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] right-[-12%] w-[440px] h-[320px] rounded-full bg-purple-900/30 blur-2xl z-0" />

      {/* 로그인 처리 카드 */}
      <div className="z-10 flex flex-col items-center bg-black/50 backdrop-blur-2xl p-10 rounded-2xl shadow-2xl border border-white/10 max-w-xs w-full">
        {/* 스피너 */}
        <div className="mb-5 flex items-center justify-center">
          <span className="animate-spin inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent border-solid rounded-full"></span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight mb-2">
          로그인 처리 중...
        </div>
        <p className="text-zinc-300 text-sm text-center">
          Trend Chat에 안전하게 로그인 중입니다.
          <br />
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
}

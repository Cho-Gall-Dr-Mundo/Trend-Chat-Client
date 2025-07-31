"use client";

import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div
      className="
        min-h-screen w-full flex flex-col items-center justify-center
        bg-gradient-to-br from-[#1a0825] via-[#25144a] to-[#0a0611]
        relative overflow-hidden
      "
    >
      {/* 라이트 스팟 + 보라색 glow */}
      <div className="absolute top-[-10%] left-[-12%] w-[400px] h-[360px] rounded-full bg-purple-900/30 blur-3xl z-0" />
      <div className="absolute bottom-[-18%] right-[-12%] w-[440px] h-[320px] rounded-full bg-fuchsia-700/20 blur-2xl z-0" />
      <div className="absolute right-1/2 top-1/2 w-[700px] h-[400px] rounded-full bg-purple-900/20 blur-3xl z-0" />

      {/* 로고 & 타이틀 */}
      <div className="flex flex-col items-center mb-8 z-10">
        <button
          type="button"
          className="focus:outline-none"
          onClick={() => router.push("/")}
        >
          <Image
            src="/trendchat-logo.png"
            alt="Trend Chat Logo"
            width={240}
            height={240}
            className="mb-2 transition hover:scale-105 active:scale-95"
            priority
          />
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
}

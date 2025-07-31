"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// 심플 Eye/EyeOff SVG (Heroicons 스타일)
const EyeIcon = ({ show }: { show: boolean }) =>
  show ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.957 9.957 0 012.881-4.307M17.654 17.658A9.978 9.978 0 0012 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.957-4.411M15 12a3 3 0 01-6 0m9.543-3.542l-13 13"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3l18 18"
      />
    </svg>
  );

export default function LoginForm() {
  const router = useRouter();
  const { login, socialLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
    relative w-full flex flex-col
    rounded-2xl px-8 py-10 space-y-6
    bg-gradient-to-br from-[#0c0512]/95 via-[#150d25]/90 to-[#1a0c28]/95
    shadow-[0_8px_40px_0_rgba(55,20,100,0.27)]
    border border-purple-900/35
    backdrop-blur-2xl
    overflow-hidden
  `}
      style={{
        boxShadow:
          "0 10px 44px 0 rgba(40,10,60,0.30), 0 2px 10px 0 rgba(70,40,120,0.10)",
        border: "1.8px solid rgba(80,32,150,0.26)",
      }}
    >
      {/* 배경 글로우 */}
      <div
        className="
      pointer-events-none absolute inset-0 rounded-2xl z-0
      bg-gradient-to-tr from-purple-900/35 to-fuchsia-900/15 blur-2xl
    "
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col space-y-6">
        <h2 className="text-xl font-bold text-center text-white mb-2 tracking-tight">
          로그인
        </h2>

        {/* 이메일 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-200">
            이메일
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-zinc-400 transition"
            placeholder="이메일 주소"
            autoComplete="email"
            required
          />
        </div>

        {/* 비밀번호 + 토글 */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-200"
          >
            비밀번호
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-zinc-400 transition pr-10"
              placeholder="비밀번호"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-purple-400 transition p-1"
              tabIndex={-1}
            >
              <EyeIcon show={showPassword} />
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white font-bold py-2.5 rounded-lg transition-colors shadow"
        >
          로그인
        </button>

        {/* 회원가입 버튼 */}
        <button
          type="button"
          className="w-full bg-white/20 hover:bg-white/30 text-zinc-100 font-semibold py-2.5 rounded-lg border border-zinc-400/40 transition-colors shadow"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-2">
          <span className="flex-grow border-t border-zinc-400/30" />
          <span className="text-zinc-300 text-xs whitespace-nowrap">
            또는 소셜 계정으로 로그인
          </span>
          <span className="flex-grow border-t border-zinc-400/30" />
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="flex flex-col gap-2">
          {/* 구글 */}
          <button
            type="button"
            onClick={() => socialLogin("google")}
            className={`
        group flex items-center justify-center w-full h-12 rounded-lg
        font-semibold border border-zinc-200
        bg-white text-zinc-900
        transition-all duration-200
        hover:scale-[1.03] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]
        active:scale-100
      `}
            style={{ minWidth: 200, minHeight: 48 }}
          >
            <span className="flex items-center justify-center">
              <span className="mr-2 flex-shrink-0 transition-transform duration-200 group-hover:scale-125">
                {/* 구글 G 로고 SVG */}
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width={24}
                  height={24}
                  style={{ display: "block" }}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </span>
              <span className="text-base font-semibold">Google로 로그인</span>
            </span>
          </button>

          {/* 네이버 */}
          <button
            type="button"
            onClick={() => socialLogin("naver")}
            className={`
        group flex items-center justify-center w-full h-12 rounded-lg
        font-semibold border border-[#03c75a]
        bg-[#03c75a] text-white
        transition-all duration-200
        hover:scale-[1.03] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]
        active:scale-100
      `}
            style={{ minWidth: 200, minHeight: 48 }}
          >
            <span className="mr-2 flex-shrink-0 transition-transform duration-200 group-hover:scale-125">
              <img
                src="/naver-login.png"
                alt="네이버"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span className="text-base font-semibold">네이버로 로그인</span>
          </button>

          {/* 카카오 */}
          <button
            type="button"
            onClick={() => socialLogin("kakao")}
            className={`
        group flex items-center justify-center w-full h-12 rounded-lg
        font-semibold border border-[#fee500]
        bg-[#fee500] text-[#381e1f]
        transition-all duration-200
        hover:scale-[1.03] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]
        active:scale-100
      `}
            style={{ minWidth: 200, minHeight: 48 }}
          >
            <span className="mr-2 flex-shrink-0 transition-transform duration-200 group-hover:scale-125">
              <img
                src="/kakao-login.png"
                alt="카카오"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span className="text-base font-semibold">카카오로 로그인</span>
          </button>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import zxcvbn from "zxcvbn";

export default function SignupForm() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: "", nickname: "", password: "" });
  const [passwordStrength, setPasswordStrength] = useState(zxcvbn(""));
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(zxcvbn(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 완화된 비밀번호 조건: 8자 이상, 영문/숫자 포함
    const pw = form.password;
    const valid = pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);

    if (!valid) {
      alert("비밀번호는 8자 이상이며 영문자와 숫자를 모두 포함해야 합니다.");
      return;
    }

    await signup(form.email, form.nickname, form.password);
  };

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "❌ 매우 약함";
      case 2:
        return "⚠️ 약함";
      case 3:
        return "✅ 보통";
      case 4:
        return "💪 강함";
      default:
        return "";
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "text-red-500";
      case 2:
        return "text-yellow-500";
      case 3:
        return "text-green-400";
      case 4:
        return "text-green-500";
      default:
        return "";
    }
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
          회원가입
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
            placeholder="example@trendchat.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-zinc-400 transition"
            required
          />
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="nickname"
            className="text-sm font-medium text-zinc-200"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-zinc-400 transition"
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
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-zinc-400 transition pr-10"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-purple-400 transition p-1"
              tabIndex={-1}
            >
              {/* 동일한 EyeIcon SVG 사용 */}
              {showPassword ? (
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
              )}
            </button>
          </div>
          <p
            className={`mt-1 text-sm ${getStrengthColor(
              passwordStrength.score
            )}`}
          >
            {getStrengthLabel(passwordStrength.score)}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white font-bold py-2.5 rounded-lg transition-colors shadow"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}

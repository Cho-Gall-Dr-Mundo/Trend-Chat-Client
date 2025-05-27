"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import zxcvbn from "zxcvbn";

export default function SignupForm() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: "", nickname: "", password: "" });
  const [passwordStrength, setPasswordStrength] = useState(zxcvbn(""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(zxcvbn(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordStrength.score < 2) {
      alert("비밀번호가 너무 약합니다. 더 복잡하게 설정해주세요.");
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
    <div className="flex flex-col items-center space-y-6">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-700"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            이메일
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@trendchat.com"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium text-zinc-300">
            닉네임
          </label>
          <input
            id="name"
            type="text"
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={form.nickname}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-zinc-300">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
          <p className={`mt-1 text-sm ${getStrengthColor(passwordStrength.score)}`}>
            {getStrengthLabel(passwordStrength.score)}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition-colors"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

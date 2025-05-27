"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const error = await res.json();
      alert(`회원가입 실패: ${error.message}`);
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

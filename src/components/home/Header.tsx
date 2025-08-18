"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/notification/NotificationBell";

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <header className="relative flex items-center justify-between h-20 px-6 border-b border-zinc-700 backdrop-blur-md bg-zinc-900/50 z-20">
      {/* 로고 */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <img
            src="/trendchat-logo.png"
            alt="Trend Chat Logo"
            className="h-12 w-auto transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          />
        </Link>
      </div>

      {/* 중앙 메뉴 */}
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/trend-keyword"
          className="hover:text-purple-400 transition-colors"
        >
          트렌드 키워드
        </Link>
        <Link
          href="/trend-news"
          className="hover:text-purple-400 transition-colors"
        >
          트렌드 뉴스
        </Link>
        {user && (
          <Link
            href="/mypage"
            className="hover:text-purple-400 transition-colors"
          >
            마이페이지
          </Link>
        )}
      </nav>

      {/* 우측 알림 + 로그인/로그아웃 */}
      <div className="flex items-center space-x-3">
        {user && <NotificationBell />}
        {user ? (
          <>
            <span className="text-white text-sm">{user.nickname}</span>
            <button
              onClick={logout}
              className="bg-zinc-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="bg-zinc-700 hover:bg-zinc-800 text-white py-1 px-3 rounded"
            >
              로그인
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

"use client";

import React, { useState, useCallback } from "react";
import { Pencil } from "lucide-react";
import WelcomeBanner from "./WelcomeBanner";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import PasswordChangeForm from "./PasswordChangeForm";
import { useTotalChatRooms } from "@/hooks/useTotalChatRooms";

const UserProfile = () => {
  const { user, updateNickname, loading } = useUser();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [inputValue, setInputValue] = useState(user?.nickname ?? "");
  const [saving, setSaving] = useState(false);
  const [openPasswordChange, setOpenPasswordChange] = useState(false);

  const ROOMS_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-service/api/v1/rooms`;

  const getToken = useCallback(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null,
    []
  );

  const {
    total: totalRooms,
    error: roomsError,
    settled, // 첫 응답 끝났는지
  } = useTotalChatRooms({
    enabled: true, // ✅ 로딩 중에도 바로 요청 시작
    apiBase: ROOMS_BASE,
    withCredentials: true,
    getToken, // ✅ 메모이즈된 함수 전달(무한 재요청 방지)
    hideUntilSettled: true, // ✅ 첫 응답 전엔 숫자 표시 안 함(깜빡임 X)
  });

  // 유저 정보 불러올 때까지 대기
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-24 text-lg text-zinc-300">
        유저 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const handleSave = async () => {
    if (!inputValue.trim() || inputValue === user.nickname) {
      setIsEditingNickname(false);
      setInputValue(user.nickname);
      return;
    }
    setSaving(true);
    try {
      await updateNickname(inputValue.trim());
      setIsEditingNickname(false);
    } catch {
      alert("닉네임 변경 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <main className="flex-grow bg-gradient-to-br from-[#1a002a] to-[#260048] flex flex-col items-center">
        <WelcomeBanner nickname={user.nickname} />

        <div className="flex-1 flex justify-center items-start mt-2 w-full px-4">
          <div
            className="w-full max-w-4xl mx-auto p-8 rounded-2xl
              text-white backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]
              bg-gradient-to-br from-zinc-800/60 to-zinc-700/70"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                📋 사용자 정보
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                가입일:{" "}
                {user.createdAt
                  ? format(new Date(user.createdAt), "yyyy.MM.dd")
                  : "-"}
              </p>
            </div>

            <div className="border-b border-zinc-700 pb-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-zinc-400 text-sm">이메일</label>
                <p className="text-lg font-medium mt-1">{user.email}</p>
              </div>

              <div>
                <label className="text-zinc-400 text-sm">닉네임</label>
                <div className="mt-1 flex items-center gap-2">
                  {isEditingNickname ? (
                    <>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-zinc-700 text-white rounded-md px-2 py-1 text-sm border border-zinc-600"
                        maxLength={20}
                        disabled={saving}
                      />
                      <button
                        className="text-sm text-purple-400 hover:text-purple-300"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "저장중..." : "저장"}
                      </button>
                      <button
                        className="ml-1 text-sm text-zinc-400 hover:text-red-400"
                        onClick={() => {
                          setIsEditingNickname(false);
                          setInputValue(user.nickname);
                        }}
                        disabled={saving}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium">
                        {user.nickname}
                      </span>
                      <button
                        onClick={() => setIsEditingNickname(true)}
                        className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        <Pencil size={12} /> 닉네임 변경
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-sm">유저 등급</label>
                <p className="text-lg font-medium mt-1">
                  {user.userRole === "ROLE_PREMIUM"
                    ? "프리미엄 유저"
                    : "일반 유저"}
                </p>
              </div>

              <div className="flex items-end">
                {user.isSocial ? (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="
            inline-flex items-center gap-1 px-3 py-1 rounded-md 
            bg-zinc-800/70 border border-zinc-700 text-zinc-400 
            font-semibold text-sm opacity-80 cursor-not-allowed
            select-none
          "
                        title="소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-zinc-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                          />
                        </svg>
                        비밀번호 변경 불가
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 mt-0.5 pl-1">
                      * 소셜 로그인 사용자는 비밀번호 변경이 지원되지 않습니다.
                    </span>
                  </div>
                ) : (
                  <button
                    className="bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-700 hover:to-purple-950 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] shadow"
                    onClick={() => setOpenPasswordChange(true)}
                  >
                    비밀번호 변경
                  </button>
                )}
              </div>
              {openPasswordChange && (
                <PasswordChangeForm
                  onClose={() => setOpenPasswordChange(false)}
                />
              )}
            </div>

            <div className="flex items-center text-sm text-purple-300">
              🔥 참여한 채팅방:
              {!settled ? (
                <span className="ml-2 inline-block h-4 w-10 rounded bg-zinc-700/50 animate-pulse" />
              ) : roomsError ? (
                <>
                  <b className="ml-1 text-red-300">-</b>
                  <span className="ml-2 text-zinc-400">
                    (오류: {roomsError})
                  </span>
                </>
              ) : (
                <b className="ml-1 text-purple-200">
                  {typeof totalRooms === "number" ? totalRooms : 0}개
                </b>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

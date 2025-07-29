"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import WelcomeBanner from "./WelcomeBanner";

const UserProfile = () => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("홍길동");
  const [inputValue, setInputValue] = useState(nickname);

  const handleSave = () => {
    setNickname(inputValue);
    setIsEditingNickname(false);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <main className="flex-grow bg-gradient-to-br from-[#1a002a] to-[#260048] flex flex-col items-center">
        <WelcomeBanner nickname={nickname} />

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
              <p className="text-sm text-zinc-400 mt-1">가입일: 2024.12.05</p>
            </div>

            <div className="border-b border-zinc-700 pb-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-zinc-400 text-sm">이메일</label>
                <p className="text-lg font-medium mt-1">user@example.com</p>
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
                      />
                      <button
                        className="text-sm text-purple-400 hover:text-purple-300"
                        onClick={handleSave}
                      >
                        저장
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium">{nickname}</span>
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
                <p className="text-lg font-medium mt-1">일반 유저</p>
              </div>

              <div className="flex items-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:scale-[1.02]">
                  비밀번호 변경
                </button>
              </div>
            </div>

            <div className="flex items-center text-sm text-purple-300">
              🔥 참여한 채팅방: <b className="ml-1 text-purple-200">4개</b>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

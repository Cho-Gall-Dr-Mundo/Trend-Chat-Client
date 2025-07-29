"use client";

import HomeLayout from "@/components/home/HomeLayout";
import React from "react";
import UserProfile from "@/components/mypage/UserProfile";

export default function MyPage() {
  return (
    <HomeLayout onChatClick={() => {}}>
      <div className="min-h-[calc(100vh-80px)]">
        {" "}
        {/* 헤더/푸터 빼고 전체 높이 확보 */}
        <UserProfile />
      </div>
    </HomeLayout>
  );
}

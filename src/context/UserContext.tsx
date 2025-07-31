"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  email: string;
  nickname: string;
  userId: string;
  userRole: string;
  createdAt: string;
  isSocial: boolean;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 유저 정보 불러오기
  const refreshUser = async () => {
    try {
      const res = await api.get("/user-service/api/v1/users/me");
      setUser(res.data);
    } catch (e) {
      setUser(null);
      // 로그아웃 등 에러 핸들링 필요시 추가
    } finally {
      setLoading(false);
    }
  };

  if (typeof window !== "undefined") {
    window.__refreshUser__ = refreshUser;
  }

  // 닉네임 수정
  const updateNickname = async (nickname: string) => {
    await api.patch("/user-service/api/v1/users/nickname", { nickname });
    setUser((prev) => (prev ? { ...prev, nickname } : prev));
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await api.patch("/user-service/api/v1/users/password", {
      currentPassword,
      newPassword,
    });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, refreshUser, updateNickname, changePassword }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}

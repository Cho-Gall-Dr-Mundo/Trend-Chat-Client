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
    } finally {
      setLoading(false);
    }
  };

  if (typeof window !== "undefined") {
    window.__refreshUser__ = refreshUser;
  }

  // 닉네임 수정
  const updateNickname = async (nickname: string) => {
    // 닉네임 변경 API 호출
    const res = await api.patch("/user-service/api/v1/users/nickname", {
      nickname,
    });

    // 새 토큰은 응답 헤더(권장)나 body에 포함된다고 가정
    const newAccessToken =
      res.headers["authorization"] ||
      res.headers["access-token"] ||
      res.headers["x-access-token"] ||
      (res.data && res.data.accessToken);

    if (newAccessToken) {
      const tokenValue =
        typeof newAccessToken === "string" &&
        newAccessToken.startsWith("Bearer ")
          ? newAccessToken.substring(7)
          : newAccessToken;

      // 새 토큰 저장 + storage 브로드캐스트(모든 탭 동기화)
      localStorage.setItem("access_token", tokenValue);
      localStorage.setItem("access_token_updated_at", Date.now().toString());
    }

    // 닉네임도 state에 반영
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
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "access_token_updated_at") {
        // 모든 탭에서 토큰 변경 감지 시 새로고침(혹은 강제 상태 리로드)
        window.location.reload();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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

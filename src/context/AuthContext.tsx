"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  email: string;
  nickname: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, nickname: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(); // 앱 시작 시 로그인된 유저 불러오기
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user-service/api/v1/users/me");
      console.log("✅ user fetched", res.data);
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/user-service/api/v1/auth/login", {
      email,
      password,
    });

    const token = res.headers["authorization"] || res.data?.accessToken;
    if (token) {
      const raw = token.startsWith("Bearer ") ? token.substring(7) : token;
      localStorage.setItem("access_token", raw);
    }

    await fetchUser();
    router.push("/");
  } catch (err: any) {
    const message = err.response?.data?.message || "로그인 실패";
    alert(message);
  }
};


  const signup = async (email: string, nickname: string, password: string) => {
    try {
      await api.post("/user-service/api/v1/auth/signup", {
        email,
        nickname,
        password,
      });
      router.push("/login");
    } catch (err: any) {
      const message = err.response?.data?.message || "회원가입 실패";
      alert(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

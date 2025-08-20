"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  email: string;
  nickname: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, nickname: string, password: string) => Promise<void>;
  socialLogin: (provider: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 추가됨

  useEffect(() => {
    fetchUser(); // 앱 시작 시 로그인된 유저 불러오기
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user-service/api/v1/users/me");
      console.log("✅ user fetched", res.data);
      const { email, nickname, userId } = res.data;
      localStorage.setItem("user_uuid", userId);
      setUser({ email, nickname, userId });
      console.log("✅ user fetched", user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false); // 무조건 로딩 종료
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

      localStorage.setItem("user_email", email); // 채팅 전송용 sender 저장
      await fetchUser();
      router.push("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "로그인 실패";
      alert(message);
    }
    if (window.__refreshUser__) {
      await window.__refreshUser__();
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

  const socialLogin = (provider: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    window.location.href = `${baseUrl}/user-service/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      // 1. 서버에 logout API 요청 (access token, 쿠키 자동 포함)
      await api.post("/user-service/api/v1/users/logout");
    } catch (e) {
      // 에러 무시 (이미 만료 등)
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_uuid");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, signup, socialLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

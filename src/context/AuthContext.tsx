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
      const { email, name, userId } = res.data;
      setUser({ email, nickname: name, userId });
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

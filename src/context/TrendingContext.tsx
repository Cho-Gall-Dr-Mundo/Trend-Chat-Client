"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";

interface TrendItem {
  keyword: string;
  traffic: number;
}

interface TrendingContextType {
  top10: TrendItem[];
  isLoading: boolean;
}

const TrendingContext = createContext<TrendingContextType | null>(null);

export const TrendingProvider = ({ children }: { children: ReactNode }) => {
  const [top10, setTop10] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrends = async () => {
    try {
      const res = await api.get<TrendItem[]>(
        "/trend-service/api/v1/trend-keywords/top10"
      );
      setTop10(res.data);
    } catch (err) {
      console.error("실시간 트렌드 키워드 로딩 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TrendingContext.Provider value={{ top10, isLoading }}>
      {children}
    </TrendingContext.Provider>
  );
};

export const useTrending = () => {
  const context = useContext(TrendingContext);
  if (!context) {
    throw new Error("useTrending must be used within a TrendingProvider");
  }
  return context;
};

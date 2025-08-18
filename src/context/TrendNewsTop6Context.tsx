"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";

export interface TrendNewsTop6 {
  keyword: string;
  summary: string;
  blogPost: string;
  majorCategories: string[];
  subCategories: string[];
}

interface TrendNewsTop6ContextType {
  news: TrendNewsTop6[];
  loading: boolean;
  fetchTop6: () => Promise<void>;
}

const TrendNewsTop6Context = createContext<
  TrendNewsTop6ContextType | undefined
>(undefined);

export const TrendNewsTop6Provider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [news, setNews] = useState<TrendNewsTop6[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTop6 = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trend-service/api/v1/trends/news/top6");
      setNews(res.data.content);
    } catch (err) {
      console.error("❌ Top6 트렌드 뉴스 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop6();
  }, []);

  return (
    <TrendNewsTop6Context.Provider value={{ news, loading, fetchTop6 }}>
      {children}
    </TrendNewsTop6Context.Provider>
  );
};

export const useTrendNewsTop6 = () => {
  const context = useContext(TrendNewsTop6Context);
  if (!context)
    throw new Error(
      "useTrendNewsTop6 must be used within TrendNewsTop6Provider"
    );
  return context;
};

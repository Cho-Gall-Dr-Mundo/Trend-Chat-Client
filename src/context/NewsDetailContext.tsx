"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import api from "@/lib/api";

interface NewsDetail {
  keyword: string;
  summary: string;
  blogPost: string;
  majorCategories: string[];
  subCategories: string[];
}

interface NewsDetailContextType {
  news: NewsDetail | null;
  loading: boolean;
  fetchNews: (keyword: string) => void;
}

const NewsDetailContext = createContext<NewsDetailContextType | undefined>(
  undefined
);

export const NewsDetailProvider = ({ children }: { children: ReactNode }) => {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNews = useCallback(async (keyword: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/trend-service/api/v1/trends/news/${keyword}`);
      console.log("뉴스 정보:", res.data);
      setNews(res.data);
    } catch (err) {
      console.error("❌ 뉴스 단건 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <NewsDetailContext.Provider value={{ news, loading, fetchNews }}>
      {children}
    </NewsDetailContext.Provider>
  );
};

export const useNewsDetail = () => {
  const context = useContext(NewsDetailContext);
  if (!context)
    throw new Error("useNewsDetail must be used within a NewsDetailProvider");
  return context;
};

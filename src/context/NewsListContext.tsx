"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

export interface TrendNews {
  keyword: string;
  summary: string;
  majorCategories: string[];
  subCategories: string[];
}

interface NewsContextType {
  news: TrendNews[];
  isLoading: boolean;
  search: string;
  selectedMajor: string | null;
  selectedSub: string | null;
  page: number;
  totalPages: number;
  setSearch: (s: string) => void;
  setSelectedMajor: (m: string | null) => void;
  setSelectedSub: (s: string | null) => void;
  setPage: (p: number) => void;
  sort: string;
  setSort: (sort: string) => void;
}

const NewsListContext = createContext<NewsContextType | undefined>(undefined);

export const NewsListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [news, setNews] = useState<TrendNews[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/trend-service/api/v1/trends/news", {
          params: {
            major: selectedMajor,
            sub: selectedSub,
            search,
            sort,
            page: page - 1,
            size: 12,
          },
        });
        setNews(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("❌ 뉴스 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [search, selectedMajor, selectedSub, page, sort]);

  return (
    <NewsListContext.Provider
      value={{
        news,
        isLoading,
        search,
        selectedMajor,
        selectedSub,
        page,
        totalPages,
        setSearch,
        setSelectedMajor,
        setSelectedSub,
        setPage,
        sort,
        setSort,
      }}
    >
      {children}
    </NewsListContext.Provider>
  );
};

export const useNewsList = () => {
  const context = useContext(NewsListContext);
  if (!context)
    throw new Error("useNewsList must be used within NewsListProvider");
  return context;
};

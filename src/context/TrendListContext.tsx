"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import api from "@/lib/api";

export interface Trend {
  keyword: string;
  summary: string;
  majorCategory: string;
  subCategory: string | null;
}

interface TrendListContextType {
  trends: Trend[];
  isLoading: boolean;
  sort: string;
  page: number;
  totalPages: number;
  selectedMajor: string | null;
  selectedSub: string | null;
  search: string;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  setSelectedMajor: (major: string | null) => void;
  setSelectedSub: (sub: string | null) => void;
  setSearch: Dispatch<SetStateAction<string>>;
}

const TrendListContext = createContext<TrendListContextType | undefined>(
  undefined
);

export const TrendListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/trend-service/api/v1/trends`, {
          params: {
            major: selectedMajor,
            sub: selectedSub,
            sort,
            page: page - 1,
            size: 12,
            search, // 🔍 이 부분 추가
          },
        });
        setTrends(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("❌ 트렌드 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, [selectedMajor, selectedSub, sort, page, search]);

  return (
    <TrendListContext.Provider
      value={{
        trends,
        isLoading,
        sort,
        setSort,
        page,
        setPage,
        totalPages,
        selectedMajor,
        selectedSub,
        setSelectedMajor,
        setSelectedSub,
        search,
        setSearch,
      }}
    >
      {children}
    </TrendListContext.Provider>
  );
};

export const useTrendList = () => {
  const context = useContext(TrendListContext);
  if (!context) {
    throw new Error("useTrendList must be used within a TrendListProvider");
  }
  return context;
};

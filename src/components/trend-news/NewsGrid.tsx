"use client";

import { useNewsList } from "@/context/NewsListContext";
import NewsCard from "./NewsCard";

const NewsGrid = () => {
  const { news, isLoading, totalPages, page, setPage, sort, setSort } =
    useNewsList();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (news.length === 0) return <p>해당 조건의 뉴스가 없습니다.</p>;

  return (
    <>
      {/* 정렬 UI */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={handleSortChange}
          className="bg-zinc-800 text-white border border-zinc-600 rounded px-3 py-1"
        >
          <option value="recent">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {news.map((n) => (
          <NewsCard key={n.keyword} news={n} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-700 text-zinc-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default NewsGrid;

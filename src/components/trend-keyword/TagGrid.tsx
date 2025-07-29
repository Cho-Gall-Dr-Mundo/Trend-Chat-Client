"use client";

import React from "react";
import { useTrendRooms } from "@/context/ChatStatContext";
import { useTrendList } from "@/context/TrendListContext";
import { useRoomJoin } from "@/hooks/useRoomJoin";

const TagGrid: React.FC = () => {
  const { allRooms, rooms: trendStats } = useTrendRooms();
  const {
    trends,
    isLoading,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    selectedMajor,
    selectedSub,
    search,
  } = useTrendList();
  const { handleRoomClick } = useRoomJoin();

  if (isLoading)
    return <p className="text-zinc-400 mt-6 text-center">로딩 중...</p>;

  const filteredTrends = trends.filter((trend) => {
    const matchSearch = search
      ? trend.keyword.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchSearch;
  });

  if (filteredTrends.length === 0) {
    return (
      <p className="text-zinc-400 mt-6 text-center animate-fade-in">
        해당 조건에 맞는 트렌드 키워드가 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-center">
          📰 {selectedSub ?? selectedMajor ?? "전체"} 트렌드 키워드
        </h2>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="ml-auto bg-zinc-700 text-white px-3 py-1 rounded text-sm border border-zinc-600"
        >
          <option value="recent">최신순</option>
          <option value="oldest">오래된 순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
        {filteredTrends.map((trend) => {
          const matchedRoom = allRooms.find(
            (room) => room.title === trend.keyword
          );
          const stat = trendStats.find((r) => r.title === trend.keyword);

          return (
            <div
              key={trend.keyword}
              className="bg-zinc-800 rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col gap-2 cursor-pointer"
              onClick={async () => {
                if (matchedRoom) {
                  await handleRoomClick(matchedRoom.id, matchedRoom.title);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <div className="flex flex-wrap gap-1">
                    {(trend.subCategories?.length > 0
                      ? trend.subCategories
                      : trend.majorCategories || []
                    ).map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-zinc-400">
                  {matchedRoom ? "🔥 채팅방 있음" : "❌ 없음"}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg">#{trend.keyword}</h3>
              <p className="text-sm text-zinc-400">
                📝 {trend.summary || "설명 없음"}
              </p>
              {matchedRoom && stat && (
                <div className="text-xs text-purple-300 mt-1">
                  🧑 {stat.participants.toLocaleString()}명 / 💬{" "}
                  {stat.messages.toLocaleString()}건
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && filteredTrends.length > 1 && (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded bg-zinc-700 text-zinc-300 disabled:opacity-50"
          >
            ◀
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(page - p) <= 2) return true;
              return false;
            })
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showDots = prev && p - prev > 1;
              return (
                <React.Fragment key={p}>
                  {showDots && <span className="px-2">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${
                      p === page
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded bg-zinc-700 text-zinc-300 disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      )}
    </>
  );
};

export default TagGrid;

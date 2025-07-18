"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTrending } from "@/context/TrendingContext";

const TrendingKeywords: React.FC = () => {
  const { top10, isLoading } = useTrending();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showList, setShowList] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % top10.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [top10]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const delta = e.deltaY;

      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if ((atTop && delta < 0) || (atBottom && delta > 0)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (isLoading || top10.length === 0) return null;

  const current = top10[index];

  return (
    <div className="w-full flex justify-center px-4 py-6 bg-gradient-to-b from-zinc-900/70 to-zinc-800/50 border-b border-zinc-700 backdrop-blur-md z-20">
      <div
        className="relative bg-zinc-900/60 rounded-xl px-6 py-4 flex flex-col items-center shadow-lg shadow-purple-700/20 w-full max-w-md transition-all duration-300"
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
      >
        {/* 타이틀 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs sm:text-sm text-purple-400 font-semibold tracking-wide uppercase">
            📊 실시간 트렌드 키워드
          </span>
        </div>

        {/* 현재 키워드 */}
        <div className="h-[28px] flex items-center justify-center overflow-hidden">
          <span
            key={index}
            className={`text-lg sm:text-xl font-bold text-purple-300 transition-all duration-500 ease-in-out
              ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
              drop-shadow-[0_0_5px_rgba(168,85,247,0.6)]`}
          >
            {index + 1}. {current.keyword}
          </span>
        </div>

        {/* 드롭다운 목록 */}
        <div
          className={`absolute top-full left-0 mt-0 w-full transition-all duration-300 ease-in-out origin-top z-30
            ${
              showList
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            }
          `}
        >
          <ul
            ref={listRef}
            className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-xl max-h-64 overflow-y-auto p-3
                        space-y-2 text-sm text-white border border-purple-700/40 shadow-[0_4px_12px_rgba(128,0,255,0.25)] backdrop-blur-sm
                        ring-1 ring-purple-500/30 transition-all duration-300 custom-scrollbar"
          >
            {top10.map((item, i) => (
              <li
                key={item.keyword}
                className="hover:bg-zinc-700/60 px-3 py-1 rounded cursor-default transition-colors"
              >
                {i + 1}. {item.keyword}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrendingKeywords;

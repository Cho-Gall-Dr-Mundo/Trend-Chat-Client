"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import SearchBar from "@/components/trend-keyword/SearchBar";
import TagGrid from "@/components/trend-keyword/TagGrid";
import { TrendListProvider, useTrendList } from "@/context/TrendListContext";
import { useState } from "react";

const majorToSubMap: Record<string, string[]> = {
  정치: [],
  경제: ["증권/금융", "부동산", "산업/기업", "생활경제/소비자"],
  사회: ["사건/사고", "노동/복지", "교육", "환경", "법원/검찰"],
  "생활/문화": [
    "음식/맛집",
    "여행/레저",
    "패션/뷰티",
    "건강/의학",
    "종교",
    "결혼/육아",
    "공연/전시",
  ],
  세계: ["아시아/중동", "미주/유럽/아프리카", "국제기구"],
  "IT/과학": [
    "인터넷/통신",
    "모바일/가전",
    "게임/콘텐츠",
    "미래기술/AI",
    "과학일반",
  ],
  연예: ["방송/TV", "영화", "음악/가요", "스타/인물"],
  스포츠: ["축구", "야구", "농구/배구", "골프", "스포츠일반"],
  "오피니언/칼럼": [],
  날씨: [],
  지역: [],
  "기타/특집": [],
};

const TrendKeywordsContent = () => {
  const {
    selectedMajor,
    selectedSub,
    setSelectedMajor,
    setSelectedSub,
    search,
    setSearch,
    setPage,
  } = useTrendList();

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {Object.keys(majorToSubMap).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedMajor(cat === selectedMajor ? null : cat);
              setSelectedSub(null);
              setPage(1);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full border ${
              selectedMajor === cat
                ? "bg-purple-500 text-white"
                : "bg-zinc-800 text-zinc-300"
            } transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedMajor && majorToSubMap[selectedMajor]?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {majorToSubMap[selectedMajor].map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSub(sub === selectedSub ? null : sub);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSub === sub
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-700 text-zinc-300"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <SearchBar search={search} setSearch={setSearch} />
      <TagGrid />
    </>
  );
};

export default function TrendKeywordsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white">
      <Header />
      <main className="flex-grow py-16 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-10 text-center">트렌드 키워드</h1>
        <div className="w-full max-w-5xl">
          <TrendListProvider>
            <TrendKeywordsContent />
          </TrendListProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}

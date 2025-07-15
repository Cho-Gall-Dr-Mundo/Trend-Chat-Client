"use client";

import Link from "next/link";

interface News {
  keyword: string;
  summary: string;
  majorCategories: string[];
  subCategories: string[];
}

export default function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/trend-news/${encodeURIComponent(news.keyword)}`}>
      <div className="bg-zinc-800 rounded-xl p-4 shadow-md hover:bg-zinc-700 transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{news.keyword}</h2>
        <p className="text-sm text-zinc-300 mb-3">{news.summary}</p>
        <div className="text-xs text-purple-400">
          {news.majorCategories.join(", ")} | {news.subCategories.join(", ")}
        </div>
      </div>
    </Link>
  );
}

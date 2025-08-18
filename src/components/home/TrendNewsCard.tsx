"use client";

import React from "react";
import Link from "next/link";

interface Article {
  title: string;
  source: string;
  url: string;
}

interface TrendNewsCardProps {
  topic: string;
  summary: string;
  articles: Article[];
  thumbnail?: string | null;
  onClick?: () => void;
}

const TrendNewsCard: React.FC<TrendNewsCardProps> = ({
  topic,
  summary,
  articles,
  thumbnail,
  onClick,
}) => {
  return (
    <Link
      href={`/trend-news/${encodeURIComponent(topic)}`}
      className="block" // block으로 감싸야 카드 전체가 클릭 가능
    >
      <div
        className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-5 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md flex flex-col"
        onClick={onClick}
        style={{ minHeight: "330px" }}
      >
        {thumbnail && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={thumbnail}
              alt={`${topic} 썸네일`}
              className="w-full max-w-[340px] h-[180px] object-cover rounded-xl shadow-lg border border-zinc-700 bg-zinc-900"
              loading="lazy"
            />
          </div>
        )}
        <div className="text-white font-bold text-lg mb-1">#{topic}</div>
        <div className="text-sm text-zinc-400 mb-3 line-clamp-3">
          🧠 {summary}
        </div>
        <ul className="space-y-1 text-sm text-purple-300 mt-auto">
          {articles.map((article, idx) => (
            <li key={idx}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/trend-news/${encodeURIComponent(topic)}`}
                  className="hover:underline"
                >
                  📎 {article.title}{" "}
                  <span className="text-zinc-400 text-xs">
                    ({article.source})
                  </span>
                </Link>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

export default TrendNewsCard;

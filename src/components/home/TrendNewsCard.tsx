"use client";

import React from "react";

interface Article {
  title: string;
  source: string;
  url: string;
}

interface TrendNewsCardProps {
  topic: string;
  summary: string;
  articles: Article[];
  onClick?: () => void;
}

const TrendNewsCard: React.FC<TrendNewsCardProps> = ({ topic, summary, articles, onClick }) => {
  return (
    <div
      className="bg-zinc-800/60 hover:bg-zinc-700 transition rounded-xl p-5 cursor-pointer border border-zinc-700 shadow-md backdrop-blur-md"
      onClick={onClick}
    >
      <div className="text-white font-bold text-lg mb-1">#{topic}</div>
      <div className="text-sm text-zinc-400 mb-3">🧠 {summary}</div>
      <ul className="space-y-1 text-sm text-purple-300">
        {articles.map((article, idx) => (
          <li key={idx}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              📎 {article.title} <span className="text-zinc-400 text-xs">({article.source})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendNewsCard;
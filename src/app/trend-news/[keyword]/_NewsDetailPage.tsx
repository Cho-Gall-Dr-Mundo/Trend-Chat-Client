"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useNewsDetail } from "@/context/NewsDetailContext";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ReactMarkdown from "react-markdown";

export default function NewsDetailPage() {
  const { keyword } = useParams();
  const { news, loading, fetchNews } = useNewsDetail();

  useEffect(() => {
    if (typeof keyword === "string") {
      fetchNews(keyword);
    }
  }, [keyword]);

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-400">로딩 중...</p>
    );
  if (!news)
    return (
      <p className="text-center mt-20 text-lg text-red-400">
        뉴스를 찾을 수 없습니다.
      </p>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="max-w-4xl mx-auto py-20 px-6">
        {/* 카테고리 정보 */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-purple-300 font-semibold mb-6">
          <span className="bg-purple-800/30 px-3 py-1 rounded-full">
            주요: {news.majorCategories.join(", ")}
          </span>
          <span className="text-purple-400">|</span>
          <span className="bg-purple-800/30 px-3 py-1 rounded-full">
            서브: {news.subCategories.join(", ")}
          </span>
        </div>

        {/* 블로그 본문 */}
        <article className="markdown-content">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="w-[500px] max-w-3xl mx-auto rounded-lg my-6"
                  alt={props.alt ?? "이미지"}
                />
              ),
            }}
          >
            {news.blogPost}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}

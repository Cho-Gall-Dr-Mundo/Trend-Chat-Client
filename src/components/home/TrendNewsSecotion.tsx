"use client";

import { useTrendNewsTop6 } from "@/context/TrendNewsTop6Context";
import TrendNewsCard from "@/components/home/TrendNewsCard";
import { extractFirstImageUrl } from "@/utils/markdown";

const TrendNewsSection: React.FC = () => {
  const { news, loading } = useTrendNewsTop6();

  if (loading) {
    return <div className="text-white text-center py-10">로딩 중...</div>;
  }

  if (!news.length) {
    return (
      <div className="text-white text-center py-10">
        최신 트렌드 뉴스가 없습니다.
      </div>
    );
  }

  return (
    <section className="mt-24 w-full flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-3xl font-extrabold text-white mb-4 text-center flex items-center justify-center gap-2">
          <span>📰</span>{" "}
          <span>검색량 급상승 키워드 기반 트렌드 뉴스 TOP 6</span>
        </h3>
        <p className="text-zinc-300 text-base mb-8 text-center">
          트렌드 챗 AI 에이전트가
          <br />
          최근 검색량이 급증한 키워드만 선별하여,
          <span className="hidden md:inline">
            <br />
          </span>
          관련 뉴스를 분석하고 핵심만 요약해서 전해드립니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((trend, idx) => {
            const articles = [
              {
                title:
                  trend.blogPost?.split("\n")[0].replace(/^#+\s*/, "") ||
                  trend.keyword,
                source: trend.majorCategories[0] || "",
                url: "",
              },
            ];
            return (
              <TrendNewsCard
                key={trend.keyword}
                topic={trend.keyword}
                summary={trend.summary}
                articles={articles}
                thumbnail={extractFirstImageUrl(trend.blogPost)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendNewsSection;

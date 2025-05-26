"use client";

import React from "react";
import TrendNewsCard from "@/components/home/TrendNewsCard";

const trendNewsData = [
  {
    topic: "AI 논쟁",
    summary: "GPT 윤리 문제와 규제 이슈로 온라인에서 뜨거운 논쟁이 벌어지고 있습니다.",
    articles: [
      {
        title: "AI 규제에 대한 글로벌 합의 가능할까?",
        source: "BBC",
        url: "https://bbc.com/ai-regulation"
      },
      {
        title: "AI 채용 시스템의 윤리적 논란 확대",
        source: "The Verge",
        url: "https://theverge.com/ai-ethics-hiring"
      }
    ]
  },
  {
    topic: "웹3.0",
    summary: "분산 웹 기술과 블록체인 ID에 대한 관심이 다시 높아지고 있습니다.",
    articles: [
      {
        title: "웹3.0 시대, 탈중앙화 플랫폼이 바꿀 미래",
        source: "Wired",
        url: "https://wired.com/web3-future"
      },
      {
        title: "블록체인 기반 개인 인증 기술 주목",
        source: "CoinDesk",
        url: "https://coindesk.com/blockchain-identity"
      }
    ]
  },
  {
    topic: "우크라 전황",
    summary: "전황 격화와 국제 정세 변화로 뉴스 보도가 이어지고 있습니다.",
    articles: [
      {
        title: "우크라이나 전선, 동부 지역 격전 지속",
        source: "Reuters",
        url: "https://reuters.com/ukraine-war"
      },
      {
        title: "나토 지원 확대, 러시아 반응은?",
        source: "CNN",
        url: "https://cnn.com/nato-ukraine-response"
      }
    ]
  },
  {
    topic: "NFT 붕괴",
    summary: "NFT 시장 거래량 급감과 프로젝트 폐쇄가 이어지고 있습니다.",
    articles: [
      {
        title: "NFT 시장, 거품 끝났나?",
        source: "The Guardian",
        url: "https://theguardian.com/nft-collapse"
      },
      {
        title: "유명 NFT 프로젝트 연쇄 도산",
        source: "Decrypt",
        url: "https://decrypt.co/nft-failure"
      }
    ]
  },
  {
    topic: "오픈AI 개편",
    summary: "GPT-5 발표 루머와 내부 인사 이동으로 주목받는 중입니다.",
    articles: [
      {
        title: "GPT-5, 이르면 내달 공개될 듯",
        source: "TechCrunch",
        url: "https://techcrunch.com/gpt-5"
      },
      {
        title: "오픈AI 내부 조직 재편 공식 발표",
        source: "Bloomberg",
        url: "https://bloomberg.com/openai-restructure"
      }
    ]
  },
  {
    topic: "네카라쿠배퇴사",
    summary: "조직문화와 연봉 격차로 인한 퇴사 러시가 커뮤니티에서 확산 중입니다.",
    articles: [
      {
        title: "개발자 퇴사 트렌드, 조직의 문제인가?",
        source: "ZDNet",
        url: "https://zdnet.co.kr/dev-quit"
      },
      {
        title: "커뮤니티 기반 퇴사 경험 공유 글 인기",
        source: "ITWorld",
        url: "https://itworld.com/quit-culture"
      }
    ]
  }
];

const TrendNewsSection: React.FC = () => {
  return (
    <section className="mt-24 w-full flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          📰 트렌드 키워드 관련 뉴스 요약
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendNewsData.map((trend, index) => (
            <TrendNewsCard
              key={index}
              topic={trend.topic}
              summary={trend.summary}
              articles={trend.articles}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendNewsSection;

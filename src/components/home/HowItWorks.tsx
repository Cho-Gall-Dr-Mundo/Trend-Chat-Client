"use client";

import React from "react";

const steps = [
  {
    step: 1,
    title: "회원가입 또는 로그인",
    description: "간단한 계정으로 시작해보세요."
  },
  {
    step: 2,
    title: "트렌드 선택",
    description: "관심 있는 이슈를 클릭하세요."
  },
  {
    step: 3,
    title: "채팅 참여",
    description: "실시간 대화에 바로 참여할 수 있어요."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto mt-16 px-6">
      <h3 className="text-center text-2xl font-bold text-white mb-6">이용 방법</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map(({ step, title, description }) => (
          <div
            key={step}
            className="border border-zinc-700 bg-zinc-800/60 rounded-xl p-6 text-center shadow-md backdrop-blur-md hover:bg-zinc-700 transition"
          >
            <div className="text-purple-400 font-extrabold text-3xl mb-2">{step}</div>
            <div className="text-white font-semibold text-lg mb-1">{title}</div>
            <div className="text-zinc-400 text-sm">{description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
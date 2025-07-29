"use client";

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface WelcomeBannerProps {
  nickname: string;
}

const WelcomeBanner = ({ nickname }: WelcomeBannerProps) => {
  return (
    <div className="max-w-4xl mx-auto pt-20 text-white text-center relative">
      <Player
        autoplay
        loop
        src="/animations/welcome.json"
        style={{ height: "120px", width: "120px" }}
        className="mx-auto mb-2"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
        👋 Welcome, <span className="text-purple-400">{nickname}</span>
      </h1>
      <p className="text-zinc-400 mt-2 text-sm">
        오늘도 트렌드를 주도해볼까요?
      </p>
    </div>
  );
};

export default WelcomeBanner;

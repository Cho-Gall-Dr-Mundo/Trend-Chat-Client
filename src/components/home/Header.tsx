"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onChatClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatClick }) => {
  return (
    <header className="relative flex items-center justify-center h-20 border-b border-zinc-700 backdrop-blur-md bg-zinc-900/50 z-20">
      <img
        src="/trendchat-logo.png"
        alt="Trend Chat Logo"
        className="h-32 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
      />
      <div className="absolute right-6">
        <Button onClick={onChatClick} className="bg-purple-600 hover:bg-purple-700">
          채팅 참여
        </Button>
      </div>
    </header>
  );
};

export default Header;

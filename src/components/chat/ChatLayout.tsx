// src/components/chat/ChatLayout.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import SidebarParticipants from "./SidebarParticipants";
import SidebarRooms from "./SidebarRooms";
import ChatSearch from "./ChatSearch";

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: Date;
  reactions?: { [emoji: string]: number };
}

interface ChatLayoutProps {
  roomId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: (input: string) => void;
  participants: string[];
}

export default function ChatLayout({
  roomId,
  messages,
  setMessages,
  input,
  setInput,
  participants,
}: ChatLayoutProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeEmojiBox, setActiveEmojiBox] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages, activeEmojiBox]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage: Message = {
      id: Date.now(),
      user: "나",
      content: input,
      timestamp: new Date(),
      reactions: {},
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleReaction = (msgId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          const currentCount = msg.reactions?.[emoji] || 0;
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return msg;
      })
    );
    setActiveEmojiBox(null);
  };

  let lastDate: Date | null = null;

  return (
    <div className="relative h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 blur-[120px] opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 blur-[160px] opacity-20 animate-ping" />

      <Card className="relative z-10 w-full max-w-6xl h-[700px] bg-zinc-800 bg-opacity-40 backdrop-blur-md flex flex-col lg:flex-row border border-zinc-700 shadow-2xl rounded-xl">
        <SidebarParticipants participants={participants} />

        <div className="flex flex-col w-full lg:w-3/5">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900/60 backdrop-blur-md text-sm font-semibold">
            <button
              className="text-purple-300 hover:bg-purple-500/20 transition px-2 py-1 rounded"
              onClick={() => (window.location.href = "/")}
            >
              ← 돌아가기
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-white tracking-wide animate-pulse">
              🔥 트렌드: {roomId}
            </div>
            <div className="flex items-center gap-2">
              <ChatSearch messages={messages} />
            </div>
          </div>

          <div className="px-4 py-2 text-xs text-zinc-300 bg-zinc-900/30 border-b border-zinc-700">
            ⚡️ "{roomId}"에 대한 최근 이슈를 기반으로 사용자들이 대화 중입니다.
          </div>

          <CardContent
            className={`flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar transition-all duration-300`}
          >
            {messages.map((msg, idx) => {
              const isMine = msg.user === "나";
              const showDate = !lastDate || !isSameDay(msg.timestamp, lastDate);
              lastDate = msg.timestamp;
              const isActive = activeEmojiBox === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {showDate && (
                    <div className="text-center text-xs text-zinc-400 my-4">
                      ───── {format(msg.timestamp, "yyyy년 M월 d일")} ─────
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: isMine ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`flex items-end gap-2 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                    onPointerDown={(e) => {
                      const timeout = setTimeout(() => {
                        setActiveEmojiBox(msg.id);
                      }, 500);
                      const clear = () => {
                        clearTimeout(timeout);
                        window.removeEventListener("pointerup", clear);
                      };
                      window.addEventListener("pointerup", clear);
                    }}
                  >
                    {!isMine && (
                      <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                        {msg.user.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`relative p-3 rounded-xl max-w-[75%] shadow-md text-white backdrop-blur-md bg-opacity-30 text-sm ${
                        isMine
                          ? "bg-purple-600 ml-auto"
                          : "bg-white/10 border border-white/10 mr-auto"
                      } ${isActive ? "mt-12" : ""}`}
                    >
                      <span className="text-xs font-semibold text-purple-200 block mb-1">
                        {msg.user} · {format(msg.timestamp, "HH:mm")}
                      </span>
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                      {msg.reactions && (
                        <div className="mt-1 flex gap-2 text-xs">
                          {Object.entries(msg.reactions).map(
                            ([emoji, count]) => (
                              <span key={emoji}>
                                {emoji} {count}
                              </span>
                            )
                          )}
                        </div>
                      )}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute bottom-full mb-2 left-0 flex gap-2 text-lg bg-zinc-800 p-1 rounded z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {["👍", "😂", "🔥"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(msg.id, emoji)}
                                className="hover:scale-110"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {isMine && (
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                        나
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </CardContent>

          <form
            className="flex p-4 border-t border-zinc-700"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              className="flex-1"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              className="ml-2 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-transform duration-150"
            >
              전송
            </Button>
          </form>
        </div>

        <SidebarRooms />
      </Card>
    </div>
  );
}

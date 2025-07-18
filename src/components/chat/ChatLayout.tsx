"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format, isSameDay } from "date-fns";
import SidebarParticipants from "./SidebarParticipants";
import SidebarRooms from "./SidebarRooms";
import ChatSearch from "./ChatSearch";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useChat } from "@/context/ChatContext";

export default function ChatLayout() {
  const { title, description, messages, input, setInput, sendMessage } =
    useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeEmojiBox, setActiveEmojiBox] = useState<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  let lastDate: Date | null = null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white overflow-x-hidden">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        {/* ✅ 블러 백그라운드 안전하게 처리 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 blur-[160px] opacity-20 animate-ping" />
        </div>

        <Card className="relative z-10 w-full max-w-6xl h-[700px] bg-zinc-800 bg-opacity-40 backdrop-blur-md flex flex-col lg:flex-row border border-zinc-700 shadow-2xl rounded-xl">
          <SidebarParticipants />

          <div className="flex flex-col w-full lg:w-[60%]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900/60 backdrop-blur-md text-sm font-semibold">
              <button
                className="text-purple-300 hover:bg-purple-500/20 transition px-2 py-1 rounded"
                onClick={() => (window.location.href = "/")}
              >
                ← 돌아가기
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 text-white tracking-wide animate-pulse">
                🔥 트렌드: {title}
              </div>
              <div className="flex items-center gap-2">
                <ChatSearch messages={messages} />
              </div>
            </div>

            <div className="px-4 py-2 text-xs text-neutral-100 bg-zinc-900/60 border-b border-zinc-700">
              <div className="group relative overflow-hidden max-h-[1.25rem] hover:max-h-[300px] transition-all duration-300 ease-in-out">
                <p className="whitespace-pre-wrap break-words drop-shadow-sm">
                  ⚡ {description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-zinc-900/80 group-hover:opacity-0 transition-opacity duration-300" />
              </div>
            </div>

            <CardContent className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar">
              {messages.map((msg) => {
                const isMine = msg.isMine;
                const showDate =
                  !lastDate || !isSameDay(msg.timestamp, lastDate);
                lastDate = msg.timestamp;

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
                      className={`flex items-end gap-2 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMine && (
                        <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {msg.senderNickname?.charAt(0)}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl max-w-[75%] shadow-md text-white bg-opacity-30 text-sm ${
                          isMine
                            ? "bg-purple-600 ml-auto"
                            : "bg-white/10 border border-white/10 mr-auto"
                        }`}
                      >
                        <span className="text-xs font-semibold text-purple-200 block mb-1">
                          {msg.senderNickname} ·{" "}
                          {format(msg.timestamp, "HH:mm")}
                        </span>
                        <div>{msg.content}</div>
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
                className="ml-2 bg-purple-600 hover:bg-purple-700"
              >
                전송
              </Button>
            </form>
          </div>

          <SidebarRooms />
        </Card>
      </main>

      <Footer />
    </div>
  );
}

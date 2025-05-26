"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";

const messagesMock = [
  {
    id: 1,
    user: "태현",
    content: "요즘 트렌드 뭐야?🔥",
    timestamp: new Date(),
  },
  {
    id: 2,
    user: "민수",
    content: "방금 올라온 이슈 봤어? ㄹㅇ 대박임.",
    timestamp: new Date(),
  },
];

export default function ChatPage({ roomId }: { roomId?: string }) {
  const [messages, setMessages] = useState(() => [...messagesMock]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      user: "나",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white flex flex-col items-center justify-center px-20 py-10 overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 blur-[120px] opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 blur-[160px] opacity-20 animate-ping" />

      <Card className="relative z-10 w-full max-w-5xl h-[700px] bg-zinc-800 bg-opacity-40 backdrop-blur-md flex flex-col border border-zinc-700 shadow-2xl rounded-xl">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900/60 backdrop-blur-md text-sm font-semibold">
          <button
            className="text-purple-300 hover:underline"
            onClick={() => (window.location.href = "/")}
          >
            ← 돌아가기
          </button>
          <div className="text-white tracking-wide animate-pulse">
            🔥 트렌드: {roomId ?? "AI 논쟁"}
          </div>
          <div className="w-20" />
        </div>

        {/* 채팅 메시지 */}
        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg) => {
            const isMine = msg.user === "나";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMine ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                    {msg.user.charAt(0)}
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[75%] shadow-md text-white backdrop-blur-md bg-opacity-30 text-sm ${
                    isMine
                      ? "bg-purple-600 ml-auto"
                      : "bg-white/10 border border-white/10 mr-auto"
                  }`}
                >
                  <span className="text-xs font-semibold text-purple-200 block mb-1">
                    {msg.user} · {format(new Date(msg.timestamp), "HH:mm")}
                  </span>
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
                {isMine && (
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    나
                  </div>
                )}
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </CardContent>

        {/* 입력창 */}
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
          <Button type="submit" className="ml-2">
            전송
          </Button>
        </form>
      </Card>
    </div>
  );
}

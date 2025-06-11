// src/components/chat/ChatSearch.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Message } from "@/types/chat";
interface ChatSearchProps {
  messages: Message[];
}

export default function ChatSearch({ messages = [] }: ChatSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return query.trim() === ""
      ? []
      : messages.filter((m) =>
          m.content.toLowerCase().includes(query.toLowerCase())
        );
  }, [query, messages]);

  return (
    <div className="relative ml-auto">
      <Input
        placeholder="🔍 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-36 text-xs h-8 rounded-md bg-zinc-800 border-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {query && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-64 overflow-y-auto bg-zinc-800 border border-zinc-700 shadow-lg rounded-md p-3 z-50 text-sm">
          {filtered.length === 0 ? (
            <div className="text-zinc-400">검색 결과 없음</div>
          ) : (
            filtered.map((msg) => (
              <div key={msg.id} className="p-2 rounded bg-zinc-700/40 mb-1">
                <div className="text-purple-300 text-xs font-semibold">
                  {msg.senderNickname} · {format(msg.timestamp, "HH:mm")}
                </div>
                <div>{msg.content}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

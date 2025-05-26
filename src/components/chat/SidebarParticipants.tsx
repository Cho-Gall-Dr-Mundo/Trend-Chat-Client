// src/components/chat/SidebarParticipants.tsx
"use client";

import { motion } from "framer-motion";

interface Props {
  participants: string[];
}

export default function SidebarParticipants({ participants }: Props) {
  return (
    <aside className="relative w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-zinc-700 bg-zinc-900/30 backdrop-blur-md p-4 text-sm overflow-hidden">
      {/* 오로라 배경 블러 효과 */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 blur-[100px] opacity-20 z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500 blur-[100px] opacity-20 z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="font-semibold text-zinc-300 mb-2">참여자</div>
        <ul className="space-y-2">
          {participants.map((name, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center gap-2 p-2 rounded-md bg-zinc-800/50 hover:bg-purple-700/40 shadow-[0_0_6px_rgba(139,92,246,0.3)] transition-transform will-change-transform"
            >
              <div className="w-7 h-7 rounded-full bg-purple-400 flex items-center justify-center text-xs font-bold">
                {name.charAt(0)}
              </div>
              <span className="text-sm text-white font-medium">{name}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

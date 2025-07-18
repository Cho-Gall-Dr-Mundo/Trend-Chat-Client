"use client";

import { ChatProvider } from "@/context/ChatContext";
import ChatLayout from "./ChatLayout";
import { useAuth } from "@/context/AuthContext";
import { SummarySSEProvider } from "@/hooks/useSummarySSE";

export default function ChatLayoutWrapper({ title }: { title: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || !user.userId) return <div>로그인이 필요합니다</div>;

  return (
    <ChatProvider title={title}>
      <SummarySSEProvider>
        <ChatLayout />
      </SummarySSEProvider>
    </ChatProvider>
  );
}

"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import { participantsMock } from "@/components/chat/mockData";

export default function ChatRoomPage() {
  const { id } = useParams();
  const decodedTitle = decodeURIComponent(id as string);

  return (
    <ChatProvider title={decodedTitle}>
      <ChatLayout participants={participantsMock} />
    </ChatProvider>
  );
}

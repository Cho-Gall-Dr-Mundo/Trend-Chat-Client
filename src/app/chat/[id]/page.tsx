"use client";

import { useParams } from "next/navigation";
import ChatLayoutWrapper from "@/components/chat/ChatLayoutWrapper";

export default function ChatRoomPage() {
  const { id } = useParams();
  const decodedTitle = decodeURIComponent(id as string);

  return <ChatLayoutWrapper title={decodedTitle} />;
}

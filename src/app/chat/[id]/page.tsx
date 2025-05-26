"use client";

import { useParams } from "next/navigation";
import ChatPage from "../page";

export default function ChatRoomPage() {
  const { id } = useParams();

  return <ChatPage roomId={id as string} />;
}

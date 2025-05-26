"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { messagesMock, participantsMock } from "@/components/chat/mockData";

export default function ChatRoomPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id as string);
  const [messages, setMessages] = useState(() => [...messagesMock]);
  const [input, setInput] = useState("");

  return (
    <ChatLayout
      roomId={decodedId}
      messages={messages}
      setMessages={setMessages}
      input={input}
      setInput={setInput}
      participants={participantsMock}
    />
  );
}

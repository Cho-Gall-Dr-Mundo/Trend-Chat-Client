"use client";

import { useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";

export default function SSEHandler() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/trend-service/api/v1/notifications/subscribe"
    );

    eventSource.addEventListener("hot-keyword", (event) => {
      const keyword = event.data;
      console.log("🔥 급상승 키워드 수신:", keyword);
      addNotification(`📈 "${keyword}" 키워드가 지금 급상승 중입니다.`);
    });

    eventSource.onopen = () => {
      console.log("✅ SSE 연결됨");
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE 연결 오류:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [addNotification]);

  return null;
}

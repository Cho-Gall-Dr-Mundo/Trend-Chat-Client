"use client";
import { useEffect, useState } from "react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationToast() {
  const { latestToastMessage } = useNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (latestToastMessage) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [latestToastMessage]);

  if (!visible || !latestToastMessage) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded shadow-md z-50">
      {latestToastMessage}
    </div>
  );
}

"use client";

import { useNotifications } from "@/context/NotificationContext";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function NotificationPopup({ onClose }: Props) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="z-50 bg-zinc-900 text-white rounded-lg shadow-xl p-4 border border-zinc-700 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">알림</h2>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-purple-300 hover:underline"
            >
              모두 읽음
            </button>
          )}
          <button onClick={onClose}>
            <X className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-sm text-zinc-400 py-8 text-center">
          새로운 알림이 없습니다.
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className="p-3 rounded cursor-pointer flex items-center gap-2 bg-purple-700 text-white font-semibold transition"
            >
              <span className="text-yellow-300 text-xs">●</span>
              <span className="truncate">{n.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useNotifications } from "@/context/NotificationContext";
import { X, Trash2 } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function NotificationPopup({ onClose }: Props) {
  const {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications();

  return (
    <div className="z-50 bg-zinc-900 text-white rounded-lg shadow-xl p-4 border border-zinc-700 max-h-96 overflow-y-auto w-80">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">알림</h2>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-300 hover:underline"
              >
                모두 읽음
              </button>
              <button
                onClick={deleteAllNotifications}
                className="text-xs text-red-400 hover:underline"
              >
                모두 삭제
              </button>
            </>
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
              className={`relative p-2 rounded transition flex justify-between items-center group cursor-pointer ${
                n.read
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-purple-700 text-white font-semibold"
              }`}
            >
              <span>{n.message}</span>
              <button
                title="삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="ml-2 text-zinc-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: number;
};

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, duration?: number) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  latestToastMessage: string | null;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestToastMessage, setLatestToastMessage] = useState<string | null>(
    null
  );
  const timeoutMap = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const saved = localStorage.getItem("notifications-read");
    if (!saved) return;

    const parsed: Record<string, boolean> = JSON.parse(saved);
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: parsed[n.id] ?? n.read,
      }))
    );
  }, []);

  useEffect(() => {
    const readMap = notifications.reduce((acc, n) => {
      acc[n.id] = n.read;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem("notifications-read", JSON.stringify(readMap));
  }, [notifications]);

  const addNotification = (message: string, duration = 5000) => {
    const exists = notifications.some((n) => n.message === message);
    if (exists) return;

    const id = crypto.randomUUID();
    const newNotification: Notification = {
      id,
      message,
      read: false,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setLatestToastMessage(message);

    const timeout = setTimeout(() => {
      setLatestToastMessage(null);
      timeoutMap.current.delete(id);
    }, duration);

    timeoutMap.current.set(id, timeout);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (!target) return prev;

      // 타이머 클리어
      const timeout = timeoutMap.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeoutMap.current.delete(id);
      }

      // 리스트에서 삭제
      return prev.filter((n) => n.id !== id);
    });
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      const timeout = timeoutMap.current.get(n.id);
      if (timeout) clearTimeout(timeout);
      timeoutMap.current.delete(n.id);
    });

    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    timeoutMap.current.delete(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        latestToastMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

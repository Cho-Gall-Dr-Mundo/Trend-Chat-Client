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
  deleteAllNotifications: () => void;
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
    const saved = localStorage.getItem("notifications");
    if (saved) {
      const parsed = JSON.parse(saved) as Notification[];
      setNotifications(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    timeoutMap.current.delete(id);
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    timeoutMap.current.clear();
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
        deleteAllNotifications,
        latestToastMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationPopup from "@/components/notification/NotificationPopup";
import { createPortal } from "react-dom";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-zinc-800 transition"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed top-16 right-6 z-50 w-80">
            <NotificationPopup onClose={() => setOpen(false)} />
          </div>,
          document.getElementById("notification-root")!
        )}
    </div>
  );
}

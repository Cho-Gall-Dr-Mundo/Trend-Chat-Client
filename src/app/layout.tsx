import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { TrendingProvider } from "@/context/TrendingContext";
import SSEHandler from "@/components/common/SSEHandler";
import NotificationToast from "@/components/common/NotificationToast";

export const metadata: Metadata = {
  title: "Trend Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <TrendingProvider>
              <SSEHandler />
              <NotificationToast />
              {children}
              <div id="notification-root" />
            </TrendingProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

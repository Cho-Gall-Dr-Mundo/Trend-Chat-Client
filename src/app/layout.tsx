import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { TrendingProvider } from "@/context/TrendingContext";
import { ChatStatProvider } from "@/context/ChatStatContext";
import SSEHandler from "@/components/common/SSEHandler";
import NotificationToast from "@/components/common/NotificationToast";
import { UserProvider } from "@/context/UserContext";

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
          <UserProvider>
            <NotificationProvider>
              <TrendingProvider>
                <ChatStatProvider>
                  <SSEHandler />
                  <NotificationToast />
                  {children}
                  <div id="notification-root" />
                </ChatStatProvider>
              </TrendingProvider>
            </NotificationProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

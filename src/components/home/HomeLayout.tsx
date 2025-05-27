import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface HomeLayoutProps {
  onChatClick: () => void;
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ onChatClick, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
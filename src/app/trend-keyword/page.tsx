"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import SearchBar from "@/components/trend-keyword/SearchBar";
import TagGrid from "@/components/trend-keyword/TagGrid";
import TrendList from "@/components/home/TrendList";
import AllRoomList from "@/components/home/AllRoomList";

export default function TrendKeywordsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 text-white">
      <Header />

      <main className="flex-grow py-16 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-10 text-center">트렌드 키워드</h1>
        <div className="w-full max-w-4xl">
          <SearchBar search={search} setSearch={setSearch} />
          <TagGrid search={search} />
        </div>

        <TrendList
          onTrendClick={(title) =>
            router.push(`/chat/${encodeURIComponent(title)}`)
          }
        />
        <AllRoomList
          onRoomClick={(title) =>
            router.push(`/chat/${encodeURIComponent(title)}`)
          }
        />
      </main>

      <Footer />
    </div>
  );
}

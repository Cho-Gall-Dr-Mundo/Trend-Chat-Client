"use client";

import { useRouter } from "next/navigation";
import HomeLayout from "@/components/home/HomeLayout";
import Hero from "@/components/home/HeroSection";
import TrendList from "@/components/home/TrendList";
import HowItWorks from "@/components/home/HowItWorks";
import TrendNewsSecotion from "@/components/home/TrendNewsSecotion";
import ClosingSection from "@/components/home/ClosingSection";

export default function HomePage() {
  const router = useRouter();

  return (
    <HomeLayout onChatClick={() => router.push("/chat")}>
      <Hero />
      <HowItWorks />
      <TrendList onTrendClick={(trend) => router.push(`/chat/${encodeURIComponent(trend)}`)} />
      <TrendNewsSecotion />
      <ClosingSection />
    </HomeLayout>
  );
}
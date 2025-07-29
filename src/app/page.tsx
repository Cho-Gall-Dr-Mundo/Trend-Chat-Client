"use client";

import { useRouter } from "next/navigation";
import HomeLayout from "@/components/home/HomeLayout";
import TrendingKeywords from "@/components/home/TrendingKeywords";
import Hero from "@/components/home/HeroSection";
import TrendList from "@/components/home/TrendList";
import HowItWorks from "@/components/home/HowItWorks";
import TrendNewsSecotion from "@/components/home/TrendNewsSecotion";
import ClosingSection from "@/components/home/ClosingSection";

export default function HomePage() {
  const router = useRouter();

  return (
    <HomeLayout onChatClick={() => router.push("/chat")}>
      <TrendingKeywords />
      <Hero />
      <HowItWorks />
      <TrendList />
      <TrendNewsSecotion />
      <ClosingSection />
    </HomeLayout>
  );
}

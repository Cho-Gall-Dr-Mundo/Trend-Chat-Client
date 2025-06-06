"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export default function SubscribePage() {
  const router = useRouter();
  const { userId } = useUser();

  return (
      <section className="bg-zinc-950 min-h-screen py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Trend Chat 구독 플랜</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE 플랜 */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-md border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-4">무료 플랜</h2>
            <ul className="text-zinc-300 text-sm text-left mb-6 space-y-2">
              <li>✅ 트렌드 채널 열람 가능</li>
              <li>⚠️ 채팅방 최대 5개까지 참여 가능</li>
            </ul>
            <p className="text-white font-semibold">₩0 / 월</p>
          </div>

          {/* PREMIUM 플랜 */}
          <div className="bg-purple-900 p-6 rounded-2xl shadow-lg border border-purple-500">
            <h2 className="text-xl font-semibold text-white mb-4">프리미엄 플랜</h2>
            <ul className="text-purple-200 text-sm text-left mb-6 space-y-2">
              <li>✅ 채팅방 무제한 참여</li>
              <li>🚀 향후 프리미엄 기능 우선 제공</li>
            </ul>
            <p className="text-white font-bold text-lg mb-4">₩9,900 / 월</p>
            <Button
                onClick={() => {
                  if (userId) {
                    router.push("/subscribe/checkout");
                  } else {
                    router.push("/login");
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-xl transition-all"
            >
              프리미엄 구독하기
            </Button>
          </div>
        </div>
      </section>
  );
}
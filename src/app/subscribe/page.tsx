"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SubscribePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user?.userId) {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("access_token"); // ✅ 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/ready", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 인증 헤더 추가
        },
        body: JSON.stringify({
          itemName: "Trend Chat 프리미엄",
          quantity: 1,
          totalAmount: 3900,
          userId: String(user.userId),
        }),
      });

      if (!res.ok) throw new Error("결제 요청 실패");

      const data = await res.json();
      if (data.nextRedirectPcUrl && data.tid) {
        sessionStorage.setItem("kakao_tid", data.tid);
        window.location.href = data.nextRedirectPcUrl;
      } else {
        alert("결제 요청 응답이 올바르지 않습니다.");
      }
    } catch (e) {
      console.error("결제 요청 중 오류 발생:", e);
      alert("결제 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="bg-zinc-950 min-h-screen py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Trend Chat 구독 플랜</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-md border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-4">무료 플랜</h2>
            <ul className="text-zinc-300 text-sm text-left mb-6 space-y-2">
              <li>✅ 트렌드 채널 열람 가능</li>
              <li>⚠️ 채팅방 최대 5개까지 참여 가능</li>
            </ul>
            <p className="text-white font-semibold">₩0 / 월</p>
          </div>

          <div className="bg-purple-900 p-6 rounded-2xl shadow-lg border border-purple-500">
            <h2 className="text-xl font-semibold text-white mb-4">프리미엄 플랜</h2>
            <ul className="text-purple-200 text-sm text-left mb-6 space-y-2">
              <li>✅ 채팅방 무제한 참여</li>
              <li>🚀 향후 프리미엄 기능 우선 제공</li>
            </ul>
            <p className="text-white font-bold text-lg mb-4">₩3,900 / 월</p>
            <Button
                onClick={handleSubscribe}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-xl transition-all"
                disabled={loading}
            >
              {loading ? "결제 페이지로 이동 중..." : "프리미엄 구독하기"}
            </Button>
          </div>
        </div>
      </section>
  );
}

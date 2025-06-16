"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const pgToken = searchParams.get("pg_token");
    const tid = sessionStorage.getItem("kakao_tid");

    // ✅ 결제 승인 처리
    if (pgToken && tid && user?.userId) {
      setLoading(true);
      fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pgToken,
          tid,
          userId: user.userId,
        }),
      })
      .then((res) => res.text())
      .then(() => {
        alert("프리미엄 구독이 완료되었습니다!");
        router.push("/");
      })
      .catch(() => {
        alert("결제 승인 중 오류가 발생했습니다.");
        setLoading(false);
      });
    }
  }, [searchParams, user, router]);

  const handleKakaoPay = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/ready", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: "Trend Chat 프리미엄",
        quantity: 1,
        totalAmount: 3900,
      }),
    });

    const json = await res.json();
    console.log("✅ 카카오페이 ready 응답:", json);

    if (json?.nextRedirectPcUrl && json?.tid) {
      sessionStorage.setItem("kakao_tid", json.tid);
      window.location.href = json.nextRedirectPcUrl;
    } else {
      alert("결제 요청 실패");
      setLoading(false);
    }
  };

  return (
      <section className="bg-zinc-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-md max-w-md w-full text-center">
          <h2 className="text-white text-xl font-bold mb-4">프리미엄 구독 안내</h2>
          <p className="text-zinc-300 text-sm mb-6">
            프리미엄 구독 시 무제한 채팅방 참여가 가능합니다.
          </p>
          <Button
              disabled={loading}
              onClick={handleKakaoPay}
              className="w-full bg-yellow-400 text-black rounded-xl"
          >
            {loading ? "결제 페이지로 이동 중..." : "카카오페이로 결제하기"}
          </Button>
        </div>
      </section>
  );
}

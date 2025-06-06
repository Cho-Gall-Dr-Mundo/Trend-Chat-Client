"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleKakaoPay = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/kakaopay/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: "Trend Chat 프리미엄", quantity: 1, totalAmount: 3900 }),
      });
      const redirectUrl = await res.text();
      if (redirectUrl.startsWith("http")) {
        window.location.href = redirectUrl;
      } else {
        alert("결제 요청에 실패했습니다.");
        setLoading(false);
      }
    } catch {
      alert("결제 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
      <section className="bg-zinc-950 min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-md max-w-md w-full border border-zinc-700">
          <h2 className="text-2xl font-bold text-white mb-4">프리미엄 구독 안내</h2>
          <p className="text-white mb-6 text-sm">
            현재는 프리미엄 구독 기능을 준비 중입니다.<br />
            아래 버튼을 통해 카카오페이 결제를 체험할 수 있습니다.
          </p>
          <Button
              disabled={loading}
              onClick={handleKakaoPay}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl transition-all"
          >
            {loading ? "결제 페이지로 이동 중..." : "카카오페이로 결제하기"}
          </Button>
          <p className="text-zinc-400 text-sm mt-4">
            결제는 실제로 이루어지지 않으며, 시뮬레이션입니다.
          </p>
        </div>
      </section>
  );
}
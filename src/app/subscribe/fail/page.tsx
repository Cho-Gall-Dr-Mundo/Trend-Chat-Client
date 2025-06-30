"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function KakaoPayFailPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const tid = sessionStorage.getItem("kakao_tid");

    if (!user?.userId || !tid) {
      alert("결제 실패 정보를 확인할 수 없습니다.");
      router.push("/");
      return;
    }

    fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/fail", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        userId: String(user.userId),
        tid,
      }),
    })
    .then(() => {
      alert("결제가 실패되었습니다.");
      router.push("/");
    })
    .catch(() => {
      alert("결제 실패 처리 중 오류가 발생했습니다.");
    })
    .finally(() => {
      sessionStorage.removeItem("kakao_tid");
    });
  }, [user, router]);

  return (
      <section className="bg-zinc-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-md max-w-md w-full text-center">
          <h2 className="text-white text-xl font-bold mb-4">결제 실패</h2>
          <p className="text-zinc-300 text-sm">처리가 완료되지 않으면 홈으로 이동됩니다.</p>
        </div>
      </section>
  );
}

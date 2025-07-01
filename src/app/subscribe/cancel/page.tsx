"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function KakaoPayCancelPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const tid = sessionStorage.getItem("kakao_tid");

    if (!user?.userId || !tid) {
      sessionStorage.removeItem("kakao_tid");
      setError(true);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        userId: String(user.userId),
        tid,
      }),
    })
    .then(() => {
      alert("결제가 취소되었습니다.");
      router.push("/");
    })
    .catch(() => {
      setError(true);
      setLoading(false);
    })
    .finally(() => {
      sessionStorage.removeItem("kakao_tid");
    });
  }, [user, router]);

  return (
      <section className="bg-zinc-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-md max-w-md w-full text-center">
          {loading ? (
              <>
                <h2 className="text-white text-xl font-bold mb-4">결제 취소 처리 중...</h2>
                <p className="text-zinc-300 text-sm">잠시만 기다려주세요.</p>
              </>
          ) : error ? (
              <>
                <h2 className="text-red-500 text-xl font-bold mb-4">결제 취소 실패</h2>
                <p className="text-zinc-300 text-sm">문제가 발생했습니다. 다시 시도해주세요.</p>
              </>
          ) : null}
        </div>
      </section>
  );
}

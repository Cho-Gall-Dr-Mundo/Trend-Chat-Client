"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const pgToken = searchParams.get("pg_token");

  useEffect(() => {
    const tid = sessionStorage.getItem("kakao_tid");
    const accessToken = localStorage.getItem("access_token");

    if (!pgToken || !tid || !user?.userId || !accessToken) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/payment-service/api/v1/payments/kakaopay/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        pgToken,
        tid,
        userId: String(user.userId),
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        console.error("결제 승인 실패 응답:", errorText);
        throw new Error("결제 승인 실패");
      }
      return res.json();
    })
    .then(() => {
      alert("프리미엄 구독이 완료되었습니다.");
      router.push("/");
    })
    .catch(() => {
      alert("결제 승인 중 오류가 발생했습니다.");
      setError(true);
      setLoading(false);
    })
    .finally(() => {
      sessionStorage.removeItem("kakao_tid");
    });
  }, [pgToken, user, router]);

  return (
      <section className="bg-zinc-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-md max-w-md w-full text-center">
          {loading ? (
              <>
                <h2 className="text-white text-xl font-bold mb-4">결제 승인 중...</h2>
                <p className="text-zinc-300 text-sm">잠시만 기다려주세요.</p>
              </>
          ) : error ? (
              <>
                <h2 className="text-red-500 text-xl font-bold mb-4">결제 승인 실패</h2>
                <p className="text-zinc-300 text-sm">문제가 발생했습니다. 다시 시도해주세요.</p>
              </>
          ) : null}
        </div>
      </section>
  );
}

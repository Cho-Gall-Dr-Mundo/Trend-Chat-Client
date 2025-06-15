"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function KakaoPayCancelPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const tid = sessionStorage.getItem("kakao_tid");

    if (user?.userId && tid) {
      fetch("/api/payments/kakaopay/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          userId: user.userId,
          tid,
        }),
      })
      .then(() => {
        alert("결제가 취소되었습니다.");
        router.push("/");
      })
      .catch(() => {
        alert("결제 취소 처리 중 오류가 발생했습니다.");
      });
    }
  }, [user, router]);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [error, setError] = useState("");

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cardholder) {
      setError("모든 정보를 입력해주세요.");
      return;
    }

    // TODO: 실제 결제 연동 로직 추가 예정
    alert("결제가 완료되었습니다!");
    router.push("/me");
  };

  return (
      <section className="bg-zinc-950 min-h-screen py-20 px-4 flex flex-col items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-md max-w-md w-full border border-zinc-700">
          <h2 className="text-2xl font-bold text-white text-center mb-6">결제 정보 입력</h2>

          <div className="space-y-4">
            <input
                type="text"
                placeholder="카드번호 (16자리)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={16}
                className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-400"
            />

            <input
                type="text"
                placeholder="유효기간 (MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-400"
            />

            <input
                type="text"
                placeholder="카드 소유자 이름"
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800 text-white placeholder-zinc-400"
            />

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <Button
                onClick={handlePayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition-all"
            >
              결제하기
            </Button>
          </div>
        </div>
      </section>
  );
}
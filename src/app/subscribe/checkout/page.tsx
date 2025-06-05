'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestPayment } from '@/lib/payment-api';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const router = useRouter();
  const { userId } = useUser();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, [userId]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      await requestPayment(userId, 9900);
      setMessage('✅ 결제가 완료되었습니다!');
      setTimeout(() => router.push('/'), 2000); // 홈으로 이동
    } catch {
      setMessage('❌ 결제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
        <Card className="bg-zinc-800 shadow-md rounded-2xl p-4 w-full max-w-md text-center space-y-4">
          <CardHeader>
            <CardTitle className="text-purple-400 text-xl font-bold">결제 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
                type="text"
                placeholder="카드 번호"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 rounded bg-zinc-700 text-white"
            />
            <input
                type="text"
                placeholder="유효기간 (MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full p-2 rounded bg-zinc-700 text-white"
            />
            <input
                type="text"
                placeholder="카드 소유자 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-zinc-700 text-white"
            />
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl hover:scale-105 transition-all"
                onClick={handleSubmit}
                disabled={loading}
            >
              {loading ? '결제 중...' : '결제하기'}
            </Button>
            {message && <p className="text-sm text-purple-300 mt-2">{message}</p>}
          </CardContent>
        </Card>
      </main>
  );
}
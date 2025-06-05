'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';

export default function SubscribePage() {
  const router = useRouter();
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, [userId]);

  return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
        <Card className="bg-zinc-800 shadow-md rounded-2xl p-4 w-full max-w-md text-center space-y-4">
          <CardHeader>
            <CardTitle className="text-purple-400 text-xl font-bold">프리미엄 구독</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-200 mb-4">월 <strong className="text-purple-400">9,900원</strong>으로 모든 기능을 무제한 이용해보세요.</p>
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl hover:scale-105 transition-all"
                onClick={() => router.push('/subscribe/checkout')}
            >
              프리미엄 구독하기
            </Button>
          </CardContent>
        </Card>
      </main>
  );
}
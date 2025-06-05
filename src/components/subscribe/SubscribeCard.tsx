'use client';

import { useState } from 'react';
import { requestPayment } from '@/lib/payment-api';
import { useUser } from '@/hooks/use-user';
import { SubscribeButton } from './SubscribeButton';

export function SubscribeCard() {
  const { userId, role } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      await requestPayment(userId, 9900);
      setMessage('✅ 프리미엄 결제가 완료되었습니다.');
    } catch {
      setMessage('❌ 결제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-zinc-800 shadow-md rounded-2xl p-4 w-full max-w-md text-center space-y-4">
        <h2 className="text-purple-400 text-xl font-bold">프리미엄 구독</h2>
        <p className="text-zinc-200">월 <strong className="text-purple-400">9,900원</strong>으로 모든 기능을 무제한 이용해보세요.</p>
        <SubscribeButton
            onClick={handlePayment}
            disabled={loading || role === 'ROLE_PREMIUM'}
            loading={loading}
            isPremium={role === 'ROLE_PREMIUM'}
        />
        {message && <p className="text-sm text-purple-300 mt-2">{message}</p>}
      </div>
  );
}
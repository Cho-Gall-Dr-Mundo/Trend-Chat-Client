interface SubscribeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  isPremium: boolean;
}

export function SubscribeButton({ onClick, disabled, loading, isPremium }: SubscribeButtonProps) {
  return (
      <button
          onClick={onClick}
          disabled={disabled}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isPremium ? '이미 프리미엄입니다' : loading ? '결제 중...' : '프리미엄 구독하기'}
      </button>
  );
}
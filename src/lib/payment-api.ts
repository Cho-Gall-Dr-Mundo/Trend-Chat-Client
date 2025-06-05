export const requestPayment = async (userId: number, amount: number) => {
  console.log('[MOCK] 결제 요청됨:', userId, amount);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연
  return true; // 성공한 것처럼 처리
};
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // 모든 요청에 쿠키 포함
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 오류 시 토큰 갱신 시도
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 리프레시 토큰은 쿠키에 있으므로 별도로 전송할 필요 없음
                // withCredentials: true로 쿠키가 자동으로 전송됨
                const response = await axios.post(
                    `${BASE_URL}/api/v1/auth/refresh`,
                    {}, // 빈 객체 전송 (리프레시 토큰은 쿠키에 있음)
                    {withCredentials: true}
                );

                // 응답 헤더에서 새 액세스 토큰 추출
                const newAccessToken = response.headers['authorization'] ||
                    response.headers['access-token'] ||
                    response.headers['x-access-token'] ||
                    (response.data && response.data.accessToken);

                if (!newAccessToken) {
                    throw new Error('새 액세스 토큰을 찾을 수 없습니다');
                }

                // Bearer 접두사 제거 (필요한 경우)
                const tokenValue = typeof newAccessToken === 'string' && newAccessToken.startsWith('Bearer ')
                    ? newAccessToken.substring(7)
                    : newAccessToken;

                // 새 토큰 저장
                localStorage.setItem('access_token', tokenValue);

                // 원래 요청 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${tokenValue}`;

                // 원래 요청 재시도
                return axios(originalRequest);
            } catch (refreshError) {
                // 리프레시 실패 시 로그아웃
                localStorage.removeItem('access_token');
                localStorage.removeItem('remember_me');

                // 로그인 페이지로 리디렉션
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 모든 요청에 쿠키 포함
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
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
        const response = await axios.post(
          `${BASE_URL}/user-service/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          response.headers["authorization"] ||
          response.headers["access-token"] ||
          response.headers["x-access-token"] ||
          (response.data && response.data.accessToken);

        if (!newAccessToken) {
          throw new Error("새 액세스 토큰을 찾을 수 없습니다");
        }

        const tokenValue =
          typeof newAccessToken === "string" &&
          newAccessToken.startsWith("Bearer ")
            ? newAccessToken.substring(7)
            : newAccessToken;

        // 새 토큰 저장 + 변경 타임스탬프 브로드캐스트!
        localStorage.setItem("access_token", tokenValue);
        localStorage.setItem("access_token_updated_at", Date.now().toString());

        originalRequest.headers.Authorization = `Bearer ${tokenValue}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃 + 동기화
        localStorage.removeItem("access_token");
        localStorage.removeItem("remember_me");
        localStorage.setItem("access_token_updated_at", Date.now().toString());

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// useTotalChatRooms.ts
"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  enabled?: boolean;
  apiBase?: string;
  path?: string;
  withCredentials?: boolean;
  getToken?: () => string | null | undefined;
  // 아래 2개는 선택
  hideUntilSettled?: boolean; // 최초엔 loading을 UI에 노출하지 않음
  debounceMs?: number; // loading 표시를 딜레이하고 싶으면(ms)
};

export function useTotalChatRooms(opts: Options = {}) {
  const {
    enabled = true,
    apiBase = "/chat-service/api/v1/rooms",
    path = "/total",
    withCredentials = true,
    getToken,
    hideUntilSettled = true,
    debounceMs = 0,
  } = opts;

  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false); // ✅ 추가
  const [showLoading, setShowLoading] = useState(false); // ✅ UI용 로딩

  const abortRef = useRef<AbortController | null>(null);

  const join = (b: string, p: string) =>
    `${b.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;

  const fetchOnce = useCallback(async () => {
    if (!enabled) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getToken?.();
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(join(apiBase, path), {
        method: "GET",
        headers,
        credentials: withCredentials ? "include" : "same-origin",
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ct = res.headers.get("content-type") || "";
      let value: number;

      if (ct.includes("application/json")) {
        const data = await res.json(); // ✅ 실제 파싱
        if (typeof data === "number") value = data;
        else if (data && typeof data.total === "number")
          value = data.total; // 혹시 객체로 오면 대비
        else if (data && typeof data.count === "number") value = data.count;
        else value = Number(data);
      } else {
        value = Number((await res.text()).trim());
      }

      if (Number.isNaN(value)) throw new Error("응답 파싱 실패");
      setTotal(value);

      if (Number.isNaN(value)) throw new Error("응답 파싱 실패");
      setTotal(value);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "불러오기 실패");
        setTotal(null);
      }
    } finally {
      setLoading(false);
      setSettled(true); // ✅ 최초 요청 종료
    }
  }, [enabled, apiBase, path, withCredentials, getToken]);

  useEffect(() => {
    if (!enabled) return;
    fetchOnce();
    return () => abortRef.current?.abort();
  }, [enabled, fetchOnce]);

  // 로딩 표시 딜레이/숨김 제어
  useEffect(() => {
    if (hideUntilSettled) {
      setShowLoading(false);
      return;
    }
    if (!loading) {
      setShowLoading(false);
      return;
    }
    const t = setTimeout(() => setShowLoading(true), debounceMs);
    return () => clearTimeout(t);
  }, [loading, debounceMs, hideUntilSettled]);

  const refetch = useCallback(() => {
    if (!enabled) return;
    return fetchOnce();
  }, [enabled, fetchOnce]);

  // UI에는 showLoading을 노출, 최초엔 settled로 제어
  return { total, loading: showLoading, error, settled, refetch };
}

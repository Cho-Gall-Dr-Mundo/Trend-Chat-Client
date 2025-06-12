export interface FetchSSEOptions {
  onMessage: (event: { event: string; data: string }) => void;
  onError?: (err: any) => void;
  headers?: Record<string, string>;
  method?: "GET" | "POST";
  body?: any;
  heartbeatInterval?: number;
  reconnectInterval?: number;
}

export function fetchSSEWithReconnect(
  url: string,
  {
    onMessage,
    onError,
    headers = {},
    method = "GET",
    body,
    heartbeatInterval = 15000,
    reconnectInterval = 5000,
  }: FetchSSEOptions
) {
  let abortController: AbortController | null = null;
  let heartbeatTimeout: NodeJS.Timeout;

  const connect = () => {
    abortController = new AbortController();

    fetch(url, {
      method,
      body,
      headers: {
        ...headers,
        Accept: "text/event-stream",
      },
      signal: abortController.signal,
    })
      .then(async (res) => {
        if (!res.ok || !res.body)
          throw new Error(`SSE 연결 실패: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        const resetHeartbeat = () => {
          clearTimeout(heartbeatTimeout);
          heartbeatTimeout = setTimeout(() => {
            console.warn("SSE heartbeat timeout. Reconnecting...");
            reconnect();
          }, heartbeatInterval + 5000);
        };

        resetHeartbeat();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let lines = buffer.split("\n");
          buffer = lines.pop()!;

          let eventType = "message";

          for (const line of lines) {
            if (line.startsWith(":")) {
              resetHeartbeat();
              continue;
            }
            if (line.startsWith("event: ")) {
              eventType = line.replace("event: ", "").trim();
            }
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();
              onMessage({ event: eventType, data });
              eventType = "message"; // reset
              resetHeartbeat();
            }
          }
        }

        reconnect(); // 서버 종료 등의 경우 재연결
      })
      .catch((err) => {
        if (onError) onError(err);
        reconnect();
      });
  };

  const reconnect = () => {
    clearTimeout(heartbeatTimeout);
    abortController?.abort();
    setTimeout(connect, reconnectInterval);
  };

  connect();

  return {
    close: () => {
      clearTimeout(heartbeatTimeout);
      abortController?.abort();
    },
  };
}

// src/services/llm/mcp.client.ts
import { CONFIG } from "../../config";
import type { OllamaMessage } from "./convert";

type OllamaStreamChunk = {
  message?: { role?: string; content?: string };
  response?: string;
  done?: boolean;
};

export async function mcpChat(messages: OllamaMessage[]): Promise<string> {
  const url = `${CONFIG.MCP_BASE_URL}/chat`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 팀원 명세: messages 외 속성은 무시됨
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => "");
    throw new Error(`MCP /chat failed (${res.status}) ${txt}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let acc = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const chunk: OllamaStreamChunk = JSON.parse(line);
        const delta =
          chunk?.message?.content ??
          (typeof chunk.response === "string" ? chunk.response : "");
        if (delta) acc += delta;
      } catch {
        /* ignore parse errors per-line */
      }
    }
  }

  // 줄바꿈 없이 끝났을 가능성 보완
  const tail = buf.trim();
  if (tail) {
    try {
      const chunk: OllamaStreamChunk = JSON.parse(tail);
      const delta =
        chunk?.message?.content ??
        (typeof chunk.response === "string" ? chunk.response : "");
      if (delta) acc += delta;
    } catch {}
  }

  return acc;
}

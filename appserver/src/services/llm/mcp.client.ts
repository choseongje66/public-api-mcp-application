// src/services/llm/mcp.client.ts
import { CONFIG } from "../../config";
import type { OllamaMessage } from "./convert";

type OllamaStreamChunk = {
  message?: { role?: string; content?: string };
  response?: string;
  done?: boolean;
};

export async function* mcpChat(
  model: string,
  messages: OllamaMessage[]
): AsyncGenerator<string> {
  const url = `${CONFIG.MCP_BASE_URL}/chat`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => "");
    throw new Error(`MCP /chat failed (${res.status}) ${txt}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("{")) continue;
      try {
        const chunk: OllamaStreamChunk = JSON.parse(line);
        const delta =
          chunk?.message?.content ??
          (typeof chunk.response === "string" ? chunk.response : "");
        if (delta) yield delta;
      } catch (e) {
        console.warn("[mcp.client] stream parse error", e);
      }
    }
  }

  // 줄바꿈 없이 끝났을 가능성 보완
  if (buf.trim().startsWith("{")) {
    try {
      const chunk: OllamaStreamChunk = JSON.parse(buf.trim());
      const delta =
        chunk?.message?.content ??
        (typeof chunk.response === "string" ? chunk.response : "");
      if (delta) yield delta;
    } catch {}
  }
}

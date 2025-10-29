// appserver/src/services/llm/convert.ts
import type { MessageRole } from "@prisma/client";

/**
 * Ollama/Ollama-호환 Message 포맷
 */
export type OllamaMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  images?: string[]; // base64 또는 URL 문자열 배열
  tool_name?: string; // DB의 toolName과 매핑
};

/**
 * DB 메시지 레코드 → Ollama Message 로 변환
 */
export function toOllamaMessages(
  dbMessages: Array<{
    role: MessageRole;
    content: string;
    images?: unknown | null;
    toolName?: string | null;
  }>
): OllamaMessage[] {
  return dbMessages.map((m) => ({
    role: m.role,
    content: m.content,
    ...(m.images ? { images: m.images as string[] } : {}),
    ...(m.toolName ? { tool_name: m.toolName } : {}),
  }));
}

/**
 * Ollama Message → DB 저장용 값으로 변환
 */
export function fromOllamaMessage(convId: number, msg: OllamaMessage) {
  return {
    convId,
    role: msg.role as MessageRole,
    content: msg.content ?? "",
    images: msg.images ?? null,
    toolName: msg.tool_name ?? null,
  };
}

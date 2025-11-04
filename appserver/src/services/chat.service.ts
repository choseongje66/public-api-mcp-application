// src/services/chat.service.ts
import { prisma } from "../db/prisma";
import type { OllamaMessage } from "./llm/convert";
import { toOllamaMessages } from "./llm/convert";
import { mcpChat } from "./llm/mcp.client";

export async function saveUserMessage(convId: number, text: string) {
  return prisma.message.create({
    data: { convId, role: "user", content: text },
  });
}

export async function saveAssistantMessage(convId: number, content: string) {
  return prisma.message.create({
    data: { convId, role: "assistant", content },
  });
}

export async function updateTitleIfFirstPair(convId: number, userText: string) {
  const count = await prisma.message.count({ where: { convId } });
  if (count === 2) {
    await prisma.conversation.update({
      where: { id: convId },
      data: { title: userText.slice(0, 30) },
    });
  }
}

/** DB 히스토리 → Ollama 메시지 배열 */
export async function buildOllamaMessages(
  convId: number
): Promise<OllamaMessage[]> {
  const items = await prisma.message.findMany({
    where: { convId },
    orderBy: { id: "asc" },
    select: { role: true, content: true, payload: true }, // payload 등 확장 가능
  });

  return toOllamaMessages(
    items.map((m) => ({
      role: m.role,
      content: m.content,
      images: m.payload?.images ?? null, // payload에 넣었다면 변환
      toolName: m.payload?.toolName ?? null,
    }))
  );
}

/** 히스토리 + 최신 입력으로 MCP /chat 호출 → 최종 텍스트 */
export async function* askMcpWithHistory(
  convId: number,
  userText: string
): AsyncGenerator<string> {
  const history = await buildOllamaMessages(convId);
  const messages: OllamaMessage[] = [
    ...history,
    { role: "user", content: userText },
  ];
  yield* mcpChat("gpt-oss:20b-cloud", messages);
}

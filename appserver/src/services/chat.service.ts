import { prisma } from "../db/prisma";
// import { OllamaAdapter } from "./llm/ollama.adapter"; // 실제 붙일 때 사용
// import { callMcp } from "./llm/mcp.client";          // 필요 시 사용

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

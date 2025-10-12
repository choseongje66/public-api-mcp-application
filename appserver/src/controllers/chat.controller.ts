import type { Request, Response } from "express";
import { ChatQuerySchema } from "../schemas/chat.schema";
import {
  saveAssistantMessage,
  saveUserMessage,
  updateTitleIfFirstPair,
} from "../services/chat.service";
// import { OllamaAdapter } from "../services/llm/ollama.adapter";
// import { callMcp } from "../services/llm/mcp.client";

export async function postChatQuery(req: Request, res: Response) {
  const { convId, text } = ChatQuerySchema.parse(req.body ?? {});

  // 1) 사용자 메시지 저장
  const userMsg = await saveUserMessage(convId, text);

  // 2) (미래) MCP 호출 → 결과를 LLM 컨텍스트에 포함
  // const mcpData = await callMcp({ name: "publicLibrary.search", args: { q: text } });

  // 3) (미래) LLM 호출 — Ollama 어댑터 사용
  // const llm = new OllamaAdapter();
  // const assistantNeutral = await llm.chat([...history, { role: "user", content: textWithMcpResults }]);
  // const assistantText = assistantNeutral.content;

  // 지금은 더미 응답
  const assistantText = `요청을 받았습니다: "${text}"`;

  // 4) 어시스턴트 메시지 저장
  const asstMsg = await saveAssistantMessage(convId, assistantText);

  // 5) 첫 쌍이면 제목 자동 생성
  await updateTitleIfFirstPair(convId, text);

  res.json({ messages: [userMsg, asstMsg] });
}

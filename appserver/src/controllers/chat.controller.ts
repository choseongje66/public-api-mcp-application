// src/controllers/chat.controller.ts
import type { Request, Response } from "express";
import { ChatQuerySchema } from "../schemas/chat.schema";
import {
  saveAssistantMessage,
  saveUserMessage,
  updateTitleIfFirstPair,
  askMcpWithHistory,
} from "../services/chat.service";

export async function postChatQuery(req: Request, res: Response) {
  const { convId, text } = ChatQuerySchema.parse(req.body ?? {});

  // 1) 사용자 메시지 저장
  const userMsg = await saveUserMessage(convId, text);

  // 2) MCP 호출(히스토리 + 이번 입력)
  let assistantText = "";
  try {
    assistantText = await askMcpWithHistory(convId, text);
  } catch (e: any) {
    console.error("[MCP error]", e?.message ?? e);
    assistantText =
      "지금은 답변을 생성할 수 없어요. 잠시 후 다시 시도해 주세요.";
  }

  // 3) 어시스턴트 메시지 저장
  const asstMsg = await saveAssistantMessage(convId, assistantText);

  // 4) 첫 쌍이면 제목 자동 생성
  await updateTitleIfFirstPair(convId, text);

  // 5) 기존 프론트 호환 응답
  res.json({ messages: [userMsg, asstMsg] });
}

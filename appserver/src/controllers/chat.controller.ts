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

  // 1. 사용자 메시지 저장
  await saveUserMessage(convId, text);

  let fullAssistantText = "";
  try {
    // 2. MCP 스트림을 받아 서버 콘솔에 실시간 출력
    process.stdout.write("\n[ASSISTANT] ");
    for await (const chunk of askMcpWithHistory(convId, text)) {
      process.stdout.write(chunk);
      fullAssistantText += chunk;
    }
    process.stdout.write("\n\n");
  } catch (e: any) {
    console.error("[MCP error]", e?.message ?? e);
    fullAssistantText = "답변 생성 중 오류가 발생했습니다.";
  } finally {
    // 3. 스트림 종료 후 후처리
    if (fullAssistantText) {
      const asstMsg = await saveAssistantMessage(convId, fullAssistantText);

      await updateTitleIfFirstPair(convId, text);

      // 4. 프론트엔드에 전체 응답 전송
      res.json({ message: asstMsg });
    } else {
      // 5. 응답 스트림 종료 (오류 등으로 내용이 없을 경우)
      res.status(204).end();
    }
  }
}

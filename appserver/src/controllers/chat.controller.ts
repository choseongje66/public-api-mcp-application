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

  console.log(`[USER] convId=${convId}: ${text}`);

  // 1. 사용자 메시지 저장
  await saveUserMessage(convId, text);

  // 2. 스트리밍 응답을 위한 헤더 설정
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  let fullAssistantText = "";
  try {
    // 3. MCP 스트림을 받아 프론트엔드로 실시간 전송
    for await (const chunk of askMcpWithHistory(convId, text)) {
      res.write(chunk);
      fullAssistantText += chunk;
    }
  } catch (e: any) {
    const errorMessage =
      "[MCP 스트리밍 오류] " + (e?.message ?? "알 수 없는 오류");
    console.error(errorMessage, e);
    // 스트림이 이미 시작된 경우, 스트림에 에러 메시지를 보내고 종료
    res.write(`\n\n오류가 발생했습니다: ${e?.message}`);
  } finally {
    // 4. 스트림 종료 후 후처리 (DB 저장 등)
    if (fullAssistantText) {
      console.log(`[ASSISTANT] convId=${convId}: ${fullAssistantText}`);
      await saveAssistantMessage(convId, fullAssistantText);
      await updateTitleIfFirstPair(convId, text);
    }

    // 5. 응답 스트림 종료
    res.end();
  }
}

import type { Request, Response } from "express";
import {
  CreateConversationSchema,
  ConvIdParamSchema,
} from "../schemas/conversation.schema";
import {
  ensureDemoUser,
  listConversations,
  createConversation,
  deleteConversation,
  listMessages,
} from "../services/conversation.service";

export async function getConversations(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user!.id;
  const items = await listConversations(userId);
  res.json({ items });
}
// 생성
export async function postConversation(req: Request, res: Response) {
  const { title } = CreateConversationSchema.parse(req.body ?? {});
  // @ts-ignore
  const userId = req.user!.id;
  const conv = await createConversation(userId, title ?? null);
  res.json(conv);
}
// 삭제
export async function removeConversation(req: Request, res: Response) {
  const { id } = ConvIdParamSchema.parse(req.params);
  await deleteConversation(id);
  res.json({ ok: true, deleted: id });
}

export async function getMessages(req: Request, res: Response) {
  const { id } = ConvIdParamSchema.parse(req.params);
  const items = await listMessages(id);
  res.json({ items });
}

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

export async function getConversations(_req: Request, res: Response) {
  // 로그인 도입 전까지 데모 유저 사용
  const user = await ensureDemoUser();
  const items = await listConversations(user.id);
  res.json({ items });
}

export async function postConversation(req: Request, res: Response) {
  const { title } = CreateConversationSchema.parse(req.body ?? {});
  const user = await ensureDemoUser(); // 추후 req.user!.id 로 교체
  const conv = await createConversation(user.id, title ?? null);
  res.json(conv);
}

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

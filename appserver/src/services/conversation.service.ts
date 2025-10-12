import { prisma } from "../db/prisma";

export async function ensureDemoUser() {
  let user = await prisma.user.findFirst();
  if (!user) user = await prisma.user.create({ data: { displayName: "demo" } });
  return user;
}

export async function listConversations(userId: number) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    select: { id: true, title: true, createdAt: true },
  });
}

export async function createConversation(
  userId: number,
  title?: string | null
) {
  return prisma.conversation.create({ data: { userId, title: title ?? null } });
}

export async function deleteConversation(convId: number) {
  await prisma.message.deleteMany({ where: { convId } });
  await prisma.conversation.delete({ where: { id: convId } });
}

export async function listMessages(convId: number) {
  return prisma.message.findMany({
    where: { convId },
    orderBy: { id: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  });
}

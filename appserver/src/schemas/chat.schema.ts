import { z } from "zod";
export const ChatQuerySchema = z.object({
  convId: z.number().int(),
  text: z.string().min(1),
});

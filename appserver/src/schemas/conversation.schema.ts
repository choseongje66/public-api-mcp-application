import { z } from "zod";
export const CreateConversationSchema = z.object({
  title: z.string().optional(),
});
export const ConvIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

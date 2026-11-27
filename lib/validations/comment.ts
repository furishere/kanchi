
import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().min(1).optional().nullable(),
});

export type CreateCommentInput = z.infer<
  typeof createCommentSchema
>;


export const getCommentsQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});


export const updateCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

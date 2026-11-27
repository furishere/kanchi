
import { z } from "zod";

export const createReportSchema = z.object({
  postId: z.string().min(1).optional(),
  commentId: z.string().min(1).optional(),
  reason: z.enum([
    "harm",
    "hate",
    "identifying",
    "spam",
    "other",
  ]),
}).refine(
  (data) => Boolean(data.postId) !== Boolean(data.commentId),
  {
    message: "Provide either postId or commentId, not both",
  }
);

import { z } from "zod"

export const commentSchema = z.object({
    content : z
        .string()
        .min(1, "comment cannot be empty")
        .max(500)
})

export type commentType = z.infer<typeof commentSchema>
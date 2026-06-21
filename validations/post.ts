import {z} from "zod"

export const postSchema = z.object({
    content : z
        .string()
        .min(1)
        .max(800),
    tags : z
        .array(
            z.string()
             .trim()
             .min(1)
             .max(20)
        )
        .max(5)
        .optional()
}) 

export type PostSchema = z.infer<typeof postSchema>
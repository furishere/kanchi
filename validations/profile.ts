import {z} from "zod"

export const updateProfile = z.object({
    username : z
        .string()
        .trim()
        .min(3, "username must be at least 3 characters")
        .max(30, "username cannot exceed 30 characters")
        .optional(),
    bio : z
        .string()
        .trim()
        .max(160, "bio cannot exceed 160 characters")
        .optional()
    
})

export type UpdateProfile = z.infer<typeof updateProfile>
import {z} from "zod"

export const updateProfile = z.object({
    username : z
        .string()
        .min(3)
        .max(30)
        .optional(),
    displayName : z
        .string()
        .max(50)
        .optional(),
    bio : z
        .string()
        .max(160)
        .optional(),
    birthDate : z
        .coerce.date()
        .optional()
    
})

export type UpdateProfile = z.infer<typeof updateProfile>
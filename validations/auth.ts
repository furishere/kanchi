import {z} from "zod"

export const userSignUp = z.object({
    username : z
        .string()
        .min(3, "username must be at least 3 characters")
        .trim()
        .max(30),
    email : z
        .string()
        .email()
        .trim(),
    password : z
        .string()
        .trim()
        .min(8)
}) 

export type UserSignUpType = z.infer<typeof userSignUp>

export const userSignIn = z.object({
    email : z
        .string()
        .email()
        .trim(),
    password : z
        .string()
        .trim()
        .min(8)
})

export type userSignIn = z.infer<typeof userSignIn>
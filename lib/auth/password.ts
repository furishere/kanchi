import bcrypt from "bcryptjs"
import { z } from "zod"

const SALT_ROUNDS = 12

export async function hashPassword(password:string) : Promise<string>{
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verfiyPassword(
    password: string,
    hashedPassword: string
) : Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72,  "password must not execeed 72 characters")

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must contain at least 3 characters")
  .max(20, "Username must not exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  );

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(20),
  password: z.string().min(1).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export type LoginInput = z.infer<typeof loginSchema>;
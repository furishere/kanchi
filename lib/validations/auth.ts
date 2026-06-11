import z, { email } from "zod"

const register = z.object({
    email : z.string().email().trim(),
    password : z.string().min(8, "password must be at least 8 characters").trim()
})
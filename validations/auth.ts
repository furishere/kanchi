import {email, z} from "zod"

const userSignUp = z.object({
    username : z.string().min(3, "username must be at least 3 characters").trim(),
    email : z.string().email().trim(),
    password : z.string().trim().regex('[A-Z]', "password must be at least one UpperCase Latter")
}) 
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import { prisma } from "./prisma"

interface JWTPayload {
    userId : string
}

export async function getCurrentUser(){
    const cookieStore = await cookies()
    
        const token = cookieStore.get("token")?.value
        if(!token){
            throw new Error("Token not found")
        }
        
        const decodejwt = jwt.verify(token, JWT_SECRET!) as JWTPayload
        
        const userId = decodejwt.userId

        const user = await prisma.user.findUnique({
        where :{
            id : userId
        }
    })

    if(!user){
        throw new Error("User not found")
    }

    return user
}
import { JWT_SECRET } from "@/lib/config"
import { prisma } from "@/lib/prisma"
import { userSignIn } from "@/validations/auth"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request){
    try{
    const body = await req.json()
    
    const parseBody = userSignIn.safeParse(body)
    if(!parseBody.success){
        return Response.json({
            message : "Incorrect Inputs",
            error : parseBody.error.issues
            
        },{
            status : 400
        })
    }

    const {email, password} = parseBody.data

    const user = await prisma.user.findUnique({
        where : {
            email,
        }
    })

    if(!user){
        return Response.json({
            message : "User not exits",
        },{
            status : 401
        })
    }

    if(!user.password){
        return Response.json({
            message : "Invalid Credentials"
        },{
            status : 401
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return Response.json({
            message : "Incorrect Credentials",
        },{
            status : 401
        })
    }

    const token = jwt.sign({
        userId : user.id
    }, JWT_SECRET!,{
        expiresIn : "7d"
    })

    const response =  Response.json({
        message : "Login Successful",
        user : {
            id : user.id,
            username : user.username,
            email : user.email
        }
    },{
        status : 200
    })

    response.headers.append(
        "Set-Cookie",
        `token=${token}; httpOnly; path=/; Max-Age=31536000; SameSite=Lax`
    )

    return response
    } catch(error){
        if(error instanceof Error){
            return Response.json({
            message : "internal server error",
            error : error.message
            })
        }
    }
    
}
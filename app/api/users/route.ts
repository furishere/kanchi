import { prisma } from "@/lib/prisma"
import { userSignUp } from "@/validations/auth"
import bcrypt from "bcryptjs"

export async function POST(req: Request){
    const body = await req.json()

    const parseBody = userSignUp.safeParse(body)
    if(!parseBody.success){
        return Response.json({
            message : "Incorrect Inputs",
            error : parseBody.error.issues
        },{
            status : 400
        })
    }
    const {username, email, password} = parseBody.data

    const existingUser = await prisma.user.findUnique({
        where :{
            email : email
        }
    })

    if(existingUser){
       return Response.json({
            message : "user already exists",
        },{
            status : 409
        })
    }

    const hashpassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data : {
            email : email,
            username : username,
            password : hashpassword
        }
    })

    return Response.json({
        message : "User Created Successfully",
        user : {
            id : user.id,
            username : user.username,
            email : user.email
        }
    },{
        status : 201
    })
}

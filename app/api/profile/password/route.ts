import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changepassword } from "@/validations/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request){

    const body  = await req.json()

    const user = await getCurrentUser()
    if(!user){
        return Response.json({
            message : "unauthorized"
        },{
            status : 401
        })
    }

    const parsedData =  changepassword.safeParse(body)
    if(!parsedData.success){
        return Response.json({
            message : "Invalid Input"
        },{
            status : 400
        })
    }

    const {password} = parsedData.data

    const hashPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where : {
            id : user.id
        }, data : {
            password : hashPassword
        }
    })


    return Response.json({
        message : "password update successfully"
    },{
        status : 200
    })
}
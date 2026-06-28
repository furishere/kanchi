import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request
){
    const user = await getCurrentUser()

    const profile = await prisma.user.findUnique({
        where : {
            id : user.id
        }, select :{
            id : true,
            username : true,
            bio : true,
            displayName : true,
            email : true,
            profilePicture : true,
            profileBanner : true,
            birthDate : true,
            createdAt : true,
            _count : {
                select :{
                    posts :true,
                    comments :true,
                    likes : true
                }
            }
        }
    })

    if(!profile){
        return Response.json({
            message : "user not found",
        },{
            status : 404
        })
    }

    return Response.json({
        profile
    },{
        status : 200
    })
}
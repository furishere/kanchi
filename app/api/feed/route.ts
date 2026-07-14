import { Emotion } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req:Request){
    try{
        
    const currentUser = await  getCurrentUser()

    const {searchParams} = new URL(req.url)
    const emotion = searchParams.get("emotion")

    const posts = await prisma.post.findMany({
       orderBy : {
        createdAt : "desc"
       },
       include : {
        user : {
            select :{
                id : true,
            },
        }, _count : {
            select : {
                likes : true,
                comments : true
            }
        },
        likes : {
            where : {
                userId : currentUser.id
            },
            select : {
                id : true
            }
        }
       }
    })

    return Response.json({
        posts
    },{
        status : 200
    })

    } catch(e){
        console.error(e)

        return Response.json({
            message : "internal server error"
        },{
            status : 500
        })
    }
}
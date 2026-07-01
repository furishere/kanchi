import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
    try{
        
    const currentUser = await  getCurrentUser()

    const posts = await prisma.post.findMany({
       orderBy : {
        createdAt : "desc"
       },
       include : {
        user : {
            select :{
                id : true,
                username : true,
                profilePicture : true,
                displayName : true
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
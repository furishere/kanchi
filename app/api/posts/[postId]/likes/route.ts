import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req:Request,
    {params} :{
        params : Promise<{postId: string}>
    }
){
    try{
        const {postId} = await params

        const user = await getCurrentUser()

        const post = await prisma.post.findUnique({
            where:{
                id: postId
            }
        })

        if(!post){
            return Response.json({
                message : "post not found"
            }, {
                status : 404
            })
        }

        const like = await prisma.like.findUnique({
            where : {
                userId_postId :{
                    userId : user.id,
                    postId
                }
            }
        })

        if(like){
            await prisma.like.delete({
                where : {
                    id : like.id
                }
            })

             return Response.json({
                liked : false,
                messge : "post unliked"
            },{
                status : 200
            })
        }

        await prisma.like.create({
         data : {
            userId : user.id,
            postId
        }
            
        })

        return Response.json({
            message : "post liked"
        },{
            status : 201
        })

    } catch(error){
        console.error(error)

        return Response.json({
            message : "internal server error"
        }, {
            status : 500
        })
    }
}
import { Prisma } from "@/generated/prisma/client"
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
        if(!user){
            return Response.json({
                message : "unauthorized"
            },{
                status : 401
            })
        }

        const post = await prisma.post.findUnique({
            where:{
                id: postId
            }, select :{
                id : true
            }
        })

        if(!post){
            return Response.json({
                message : "post not found"
            }, {
                status : 404
            })
        }

        const existingLike = await prisma.like.findUnique({
            where : {
                userId_postId :{
                    userId : user.id,
                    postId
                }
            }, select : {
                id :true
            }
        })

        if(existingLike){
            await prisma.like.delete({
                where : {
                    userId_postId :{
                    userId : user.id,
                    postId
                }
            }
            })

             return Response.json({
                liked : true,
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

        if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        {
          liked: true,
          message: "Post already liked",
        },
        {
          status: 200,
        }
      );
    }

        return Response.json({
            message : "internal server error"
        }, {
            status : 500
        })
    }
}
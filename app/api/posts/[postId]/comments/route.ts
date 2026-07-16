import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/validations/comment"

export async function POST(
    req: Request,
    {params} : {
        params: Promise<{postId : string}>
    }
){
    try{
    const body = await req.json()

    const {postId} = await params

    const parsedBody =  commentSchema.safeParse(body)
    if(!parsedBody.success){
        return Response.json({
            message : "invalid inputs",
            errors : parsedBody.error.issues
        },{
            status : 400
        })
    }

    const user = await getCurrentUser()
    if(!user){
        return Response.json({
            message : "unauthorized"
        },{
            status : 401
        })
    }

    const {content} = parsedBody.data 

    const post = await prisma.post.findUnique({
        where :{
            id : postId
        }, select :{
            id:true
        }
    })

    if(!post){
        return Response.json({
            message : "post not found"
        },{
            status : 404
        })
    }


    const comment = await prisma.comment.create({
        data :{
            content,
            userId : user.id,
            postId,
        }, select :{
            id : true, 
            content : true,
            createdAt : true,
            user : {
                select : {
                    id: true
                }
            }
        }
    })

    return Response.json({
        message : "comment successfully created",
        comment
    },{
        status : 201
    })
    } catch(error){
        console.error(error)

        return Response.json({
            message : "internal server error"
        },{
            status : 500
        })
    }

}


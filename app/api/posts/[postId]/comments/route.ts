import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/validations/comment"

export async function POST(
    req: Request,
    {params} : {
        params: Promise<{postId : string}>
    }
){
    const body = await req.json()

    const {postId} = await params

    const parsedBody =  commentSchema.safeParse(body)
    if(!parsedBody.success){
        return Response.json({
            message : "invalid inputs"
        },{
            status : 400
        })
    }

    const user = await getCurrentUser()

    const {content} = parsedBody.data 

    const post = await prisma.post.findUnique({
        where :{
            id : postId
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
        }
    })

    return Response.json({
        message : "comment successfully created"
    },{
        status : 201
    })

}


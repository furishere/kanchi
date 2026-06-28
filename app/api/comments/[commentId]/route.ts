import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/validations/comment"

export async function PATCH(
    req: Request,
    {params} : {
        params : Promise<{commentId : string}>
    }
){
    try{
         const {commentId} = await params

    const user = await getCurrentUser()

    const comment = await prisma.comment.findUnique({
        where : {
            id :commentId
        }, select :{
            id: true,
            userId : true
        }
    })

    if(!comment){
        return Response.json({
            message : "comment not found"
        },{
            status : 404
        })
    }

    if(comment.userId !== user.id){
        return Response.json({
            message : "unauthorized"
        },{
            status : 403
        })
    }

    const body = await req.json()

    const parsedBody = commentSchema.safeParse(body)
    if(!parsedBody.success){
        return Response.json({
            message : "Inavild Input"
        }, {
            status : 400
        })
    }

    const {content} = parsedBody.data

    const newComment = await prisma.comment.update({
        where : {
            id : commentId
        } , data : {
            content
        }
    })

    return Response.json({
        message : "Comment updated",
        newComment
    },{
        status : 200
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

export async function DELETE(req: Request,
    {params} : {
        params : Promise<{commentId : string}>
    }
){
    try{
         const {commentId} = await params

    const user = await getCurrentUser()

    const comment = await prisma.comment.findUnique({
        where : {
            id: commentId
        }
    })

    if(!comment){
        return Response.json({
            message : "comment not found"
        },{
            status : 404
        })
    }

    if(comment.userId !== user.id){
        return Response.json({
            message : "unauthorized"
        },{
            status : 403
        })
    }

    await prisma.comment.delete({
        where : {
            id:commentId
        } 
    })

    return Response.json({
        message : "comment deleted successfully"
    },{
        status : 200
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
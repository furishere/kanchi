import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { postSchema } from "@/validations/post"

export async function GET(
    req:Request,
    {params} : {
        params :Promise<{postId : string}>
    }
){
    try{
    const {postId} = await params

    const post = await prisma.post.findUnique({
        where : {
            id : postId
        },include :{
            user : {
                select :{
                    id : true,
                    username : true,
                }
            },
            comments :{
                include :{
                    user : {
                        select : {
                            username : true,
                        }
                    }
                }
            },
            _count : {
                select : {
                    likes : true,
                    comments : true
                }
            },
        }
    })

    if(!post){
        return Response.json({
            message : "post not found"
        }, {
            status : 404
        })
    }

    return Response.json({
        post
    })

    } catch(error){
        console.error(error)
            return Response.json({
                message  : "internal server error"
            },{
                status : 500
            })
    }
}

export async function DELETE(
    req:Request,
    {params} : {
        params : Promise<{postId : string}>
    }
){
    try{
    const {postId} = await params
    
    const user = await  getCurrentUser()

    const post = await prisma.post.findUnique({
        where : {
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

    if(post.userId !== user.id){
        return Response.json({
            message : "unauthorized"
        },{
            status : 403
        })
    }

    await prisma.post.delete({
        where : {
            id: postId
        }
    })

    return Response.json({
        message : "post deleted successfully"
    },{
        status : 200
    })
    } catch(error){
        if(error instanceof Error){
            return Response.json({
                message : "internal server error"
            },{
                status : 500
            })
        }
    }
}

export async function PATCH(
    req: Request,
    {params} : {
        params : Promise<{postId : string}>
    }
){
    try{
    const {postId} = await params

    const user = await getCurrentUser()

    const post = await prisma.post.findUnique({
        where : {
            id: postId
        }
    })
    if(!post){
        return Response.json({
            message : "post not found"
        },{
            status : 404
        })
    }
    if(post.userId !== user.id){
        return Response.json({
            message : "unauthorized"
        },{
            status : 403
        })
    }

    const body = await req.json()
    
    const parseBody = postSchema.safeParse(body)
    if(!parseBody.success){
        return Response.json({
            message : "Invalid inputs"
        },{
            status : 400
        })
    }

    const updatePost = await prisma.post.update({
        where : {
            id: postId
        },data : {
            content : parseBody.data.content,
            tags : parseBody.data.emotion,
            hasTriggerWarning : parseBody.data.hasTriggerWarning
        }
    })

    return Response.json({
        updatePost
    })

    }catch(error){
        if(error instanceof Error){
            return Response.json({
                message : "internal server error"
            },{
                status : 500
            })
        }
    }
}
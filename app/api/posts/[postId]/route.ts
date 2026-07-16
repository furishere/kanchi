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
        },select :{
            id : true,
            content : true,
            emotion : true,
            hasTriggerWarning : true,
            createdAt : true,
            updatedAt : true,
            comments : {
                orderBy : {
                    createdAt : "desc"
                }, select :{
                    id : true, 
                    content : true,
                    createdAt : true
                }
            },
            _count :{
                select : {
                    likes : true,
                    comments : true
                }
            }
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
    if(!user){
        return Response.json({
            message : "unauthorized"
        },{
            status : 401
        })
    }

    const post = await prisma.post.findUnique({
        where : {
            id : postId
        }, select :{
            userId : true
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
            message : "Forbidden"
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
        console.error(error)
        return Response.json({
            message : "internal server error"
        },{
            status : 500
        })
    }
}


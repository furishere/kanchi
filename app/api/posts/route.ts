import { prisma } from "@/lib/prisma"
import { postSchema } from "@/validations/post"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: Request){
    try{

    const body = await req.json()

    const parseBody = postSchema.safeParse(body)
    if(!parseBody.success){
        return Response.json({
            message : "incorrect inputs",
            error : parseBody.error.issues
        },{
            status : 400
        })
    }

    const user = await getCurrentUser()

    const {content, tags} = parseBody.data
    
    const post = await prisma.post.create({
        data : {
            content,
            tags : tags ?? [],
            userId : user.id
        }
    })

    return Response.json({
        message : "post created successfully",
        post
    },{
        status : 201
    })
    } catch(error){
        if(error instanceof Error){
            return Response.json
            ({
                message : "internal server error",
                error : error.message
            }, {
                status : 500
            })
        }
    }
}

export async function GET(){
    try {
        const user = await getCurrentUser()

        const userPosts = await prisma.post.findMany({
            where :{
                userId : user.id
            },
            orderBy : {
                createdAt : "desc"
            }
        })

        return Response.json({
            userPosts,
        })
    }catch(error){
        if(error instanceof Error){
            return Response.json({
                message : "internal server error",
                error : error.message
            },{
                status : 500
            })
        }
    }
} 

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
    if(!user){
        return Response.json({
            message : "unauthorized"
        },{
            status : 401
        })
    }

    const {content, emotion, hasTriggerWarning} = parseBody.data
    
    const post = await prisma.post.create({
        data : {
            content,
            emotion,
            hasTriggerWarning,
            userId : user.id
        }, select : {
            id : true,
            content : true,
            emotion : true,
            hasTriggerWarning : true,
            createdAt : true,
            user :{
                select : {
                    id : true,
                    username : true
                }
            }
        }
    })

    return Response.json({
        message : "post created successfully",
        post
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


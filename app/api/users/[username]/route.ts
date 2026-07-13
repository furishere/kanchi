import { prisma } from "@/lib/prisma"

export async function GET(
    req:Request,
    {params} : {
        params : Promise <{username : string}>
    }
){
    const {username} = await params

    const user = await prisma.user.findUnique({
        where : {
            username
        }, select :{
            id : true,
            username : true,
            bio : true,
            createdAt : true,
            _count : {
                select : {
                    posts : true
                }
            },
            posts : {
                take : 10,
                orderBy : {
                    createdAt : "desc"
                },
                select : {
                    id : true,
                    content : true,
                    emotion : true,
                    hasTriggerWarning : true,
                    createdAt : true,
                    _count : {
                        select : {
                            likes : true,
                            comments : true
                        }
                    }
                }
            }
        },
    })

    if(!user){
        return Response.json({
            message : "user not found"
        },{
            status : 404
        })
    }

    return Response.json({
        user
    }, {
        status : 200
    })
}
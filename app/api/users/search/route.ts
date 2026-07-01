import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req:Request){
    try {
        
    const {searchParams} = new URL(req.url)

    const query = searchParams.get("q")

    const currentUser = await getCurrentUser()

    if(!query){
        return Response.json({
            message : "Search query is required"
        },{
            status : 400
        })
    }

    const users = await prisma.user.findMany({
        where : {
            id : {
                not : currentUser.id
            },
            OR : [
                {username : {
                    contains : query,
                    mode : "insensitive"
                }},
                {displayName : {
                    contains : query,
                    mode : "insensitive"
                }}
            ]
            }, select :{
            id : true,
            username : true,
            profilePicture : true,
            displayName : true
        }
    })
    
    return Response.json({
        users
    },{
        status : 200
    })
    } catch(error) {
        console.error(error)

        return Response.json({
            message : "internal server error"
        },{
            status: 500
        })
    }
}
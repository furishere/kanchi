import { Prisma } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/validations/profile";

export async function GET(
    req: Request
){
    const user = await getCurrentUser()

    const profile = await prisma.user.findUnique({
        where : {
            id : user.id
        }, select :{
            id : true,
            username : true,
            bio : true,
            email : true,
            createdAt : true,
            _count : {
                select :{
                    posts :true,
                    comments :true,
                    likes : true
                }
            }
        }
    })

    if(!profile){
        return Response.json({
            message : "user not found",
        },{
            status : 404
        })
    }

    return Response.json({
        profile
    },{
        status : 200
    })
}

export async function PATCH(
    req: Request
){
    try{
    const user = await getCurrentUser()

    const body = await req.json()

    const parsedBody = updateProfile.safeParse(body)
    if(!parsedBody.success){
        return Response.json({
            message : "Invalid input",
            error : parsedBody.error.issues
        },{
            status : 400
        })
    }

    const {username, bio} = parsedBody.data

    if(username !== undefined){
        const existingUser = await prisma.user.findUnique({
        where : {
            username
        }
    })

     if(existingUser && existingUser.id !== user.id){
        return Response.json({
            message : "Username already taken"
        },{
            status : 409
        })
    }
    }

    const updatedProfile = await prisma.user.update({
        where : {
            id: user.id
        },
        data : {
            ...(username !== undefined && {username}),
            ...(bio !== undefined && {bio}),
        }, select : {
                id: true,
                username: true,
                email: true,
                emailVerified: true,
                bio: true,
                updatedAt: true,
        }
    })

    return Response.json({
        message : "Profile updated successfully",
        profile : updatedProfile
    },{
        status : 200
    })
    

    } catch(error){
        console.error(error)

           if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        return Response.json(
            { message: "Username already taken" },
            { status: 409 }
        );
    }

    return Response.json(
        { message: "Internal server error" },
        { status: 500 }
    );
    }
}

export async function DELETE(){
    const user =  await getCurrentUser()

    if(!user){
        return Response.json({
            message : "user not found"
        },{
            status : 404
        })
    }

    await prisma.user.findUnique({
        where : {
            id :user.id
        }
    })

    return Response.json({
        message : "account deleted successfully"
    },{
        status : 200
    })
}
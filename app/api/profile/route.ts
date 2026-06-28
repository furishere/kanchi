import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/validations/profile";

export async function PATCH(
    req: Request
){
    try{
    const user = await getCurrentUser()

    const body = await req.json()

    const parsedBody = updateProfile.safeParse(body)
    if(!parsedBody.success){
        return Response.json({
            message : "invalid input",
            error : parsedBody.error.issues
        },{
            status : 400
        })
    }

    const {username, bio, birthDate, displayName } = parsedBody.data

    const existingUser = await prisma.user.findUnique({
        where : {
            username
        }
    })

    if(existingUser && existingUser.id !== user.id){
        return Response.json({
            message : "username already taken"
        },{
            status : 409
        })
    }

    const updatedProfile = await prisma.user.update({
        where : {
            id: user.id
        },
        data : {
            username,
            bio,
            birthDate,
            displayName
        }
    })

    return Response.json({
        message : "your profile updated sucessfully",
        profile :{
            id : updatedProfile.id,
            username : updatedProfile.username,
            displayName : updatedProfile.displayName,
            bio : updatedProfile.bio,
            birthDate : updatedProfile.birthDate,
            profilePicture : updatedProfile.profilePicture,
            profileBanner : updatedProfile.profileBanner
        }
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
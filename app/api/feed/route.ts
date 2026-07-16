import { Emotion } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const emotion = searchParams.get("emotion");

    if (
      emotion &&
      !Object.values(Emotion).includes(emotion as Emotion)
    ) {
      return Response.json(
        {
          message: "Invalid emotion",
        },
        {
          status: 400,
        }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        ...(emotion && {
          emotion: emotion as Emotion,
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        emotion: true,
        hasTriggerWarning: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: currentUser.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return Response.json(
      {
        posts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
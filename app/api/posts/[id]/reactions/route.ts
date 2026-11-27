
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { reactionSchema } from "@/lib/validations/post";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!validateOrigin(request)) {
      return csrfError();
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: postId } = await context.params;

    const body = await request.json();
    const validation = reactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid reaction type",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { type } = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.findFirst({
        where: {
          id: postId,
          status: "VISIBLE",
        },
        select: {
          id: true,
        },
      });

      if (!post) {
        return null;
      }

      const existingReaction = await tx.reaction.findUnique({
        where: {
          userId_postId_type: {
            userId: user.id,
            postId,
            type,
          },
        },
      });

      let reacted: boolean;

      if (existingReaction) {
        await tx.reaction.delete({
          where: {
            userId_postId_type: {
              userId: user.id,
              postId,
              type,
            },
          },
        });

        reacted = false;
      } else {
        await tx.reaction.create({
          data: {
            userId: user.id,
            postId,
            type,
          },
        });

        reacted = true;
      }

      const updatedPost = await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          ...(type === "FELT" && {
            feltCount: {
              [reacted ? "increment" : "decrement"]: 1,
            },
          }),
          ...(type === "WARM" && {
            warmCount: {
              [reacted ? "increment" : "decrement"]: 1,
            },
          }),
        },
        select: {
          feltCount: true,
          warmCount: true,
        },
      });

      return {
        reacted,
        type,
        ...updatedPost,
      };
    });

    if (!result) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: result.reacted
        ? "Reaction added"
        : "Reaction removed",
      reaction: {
        type: result.type,
        reacted: result.reacted,
      },
      counts: {
        feltCount: result.feltCount,
        warmCount: result.warmCount,
      },
    });
  } catch (error) {
    console.error("REACTION_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: postId } = await context.params;

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        status: "VISIBLE",
      },
      select: {
        id: true,
        feltCount: true,
        warmCount: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const user = await getCurrentUser();

    let felt = false;
    let warm = false;

    if (user) {
      const reactions = await prisma.reaction.findMany({
        where: {
          userId: user.id,
          postId,
        },
        select: {
          type: true,
        },
      });

      felt = reactions.some(
        (reaction) => reaction.type === "FELT"
      );

      warm = reactions.some(
        (reaction) => reaction.type === "WARM"
      );
    }

    return NextResponse.json({
      postId,
      counts: {
        feltCount: post.feltCount,
        warmCount: post.warmCount,
      },
      userReactions: {
        felt,
        warm,
      },
    });
  } catch (error) {
    console.error("GET_REACTIONS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

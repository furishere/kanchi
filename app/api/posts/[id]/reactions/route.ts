
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";
import { shouldCreateNotification } from "@/lib/notifications/notification-preferences";
import { reactionSchema } from "@/lib/validations/post";


interface RouteContext {
  params: Promise<{ id: string }>;
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
          message: "Invalid reaction data",
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
          authorId: true,
        },
      });

      if (!post) {
        return { error: "POST_NOT_FOUND" as const };
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

        await tx.post.update({
          where: {
            id: postId,
          },
          data:
            type === "FELT"
              ? { feltCount: { decrement: 1 } }
              : { warmCount: { decrement: 1 } },
        });

        return {
          action: "REMOVED" as const,
          type,
        };
      }

      await tx.reaction.create({
        data: {
          userId: user.id,
          postId,
          type,
        },
      });

      await tx.post.update({
        where: {
          id: postId,
        },
        data:
          type === "FELT"
            ? { feltCount: { increment: 1 } }
            : { warmCount: { increment: 1 } },
      });

      if (post.authorId !== user.id) {
        const recipient = await tx.user.findUnique({
          where: {
            id: post.authorId,
          },
          select: {
            id: true,
            notifyReactions: true,
          },
        });

        if (
          recipient &&
          shouldCreateNotification(
            {
              notifyReplies: false,
              notifyReactions: recipient.notifyReactions,
            },
            type
          )
        ) {
          await tx.notification.create({
            data: {
              userId: recipient.id,
              type,
              postId,
            },
          });
        }
      }

      return {
        action: "ADDED" as const,
        type,
      };
    });

    if ("error" in result) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message:
          result.action === "ADDED"
            ? "Reaction added successfully"
            : "Reaction removed successfully",
        ...result,
      },
      { status: 200 }
    );
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

    let userReactions: { type: "FELT" | "WARM" }[] = [];

    if (user) {
      userReactions = await prisma.reaction.findMany({
        where: {
          userId: user.id,
          postId,
        },
        select: {
          type: true,
        },
      });
    }

    return NextResponse.json({
      reactions: {
        feltCount: post.feltCount,
        warmCount: post.warmCount,
        hasFelt: userReactions.some(
          (reaction) => reaction.type === "FELT"
        ),
        hasWarmed: userReactions.some(
          (reaction) => reaction.type === "WARM"
        ),
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

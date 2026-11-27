
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";
import { updateCommentSchema } from "@/lib/validations/comment";

interface RouteContext {
  params: Promise<{
    id: string;
    commentId: string;
  }>;
}

export async function PATCH(
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

    const { id: postId, commentId } = await context.params;

    const body = await request.json();

    const validation = updateCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid comment data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
        authorId: user.id,
        status: "VISIBLE",
      },
      select: {
        id: true,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        body: validation.data.body,
      },
      select: {
        id: true,
        postId: true,
        parentId: true,
        body: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("UPDATE_COMMENT_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id: postId, commentId } = await context.params;

    const result = await prisma.comment.updateMany({
      where: {
        id: commentId,
        postId,
        authorId: user.id,
        status: "VISIBLE",
      },
      data: {
        status: "REMOVED",
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        replyCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_COMMENT_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

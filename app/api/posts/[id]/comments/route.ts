
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";
import { createCommentSchema, getCommentsQuerySchema } from "@/lib/validations/comment";

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

    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid comment data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { body: commentBody, parentId } = validation.data;

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
        return { error: "POST_NOT_FOUND" as const };
      }

      if (parentId) {
        const parentComment = await tx.comment.findFirst({
          where: {
            id: parentId,
            postId,
            status: "VISIBLE",
          },
          select: {
            id: true,
          },
        });

        if (!parentComment) {
          return { error: "PARENT_NOT_FOUND" as const };
        }
      }

      const comment = await tx.comment.create({
        data: {
          postId,
          authorId: user.id,
          body: commentBody,
          parentId: parentId ?? null,
        },
        select: {
          id: true,
          postId: true,
          parentId: true,
          body: true,
          status: true,
          createdAt: true,
        },
      });
      
const recipient = parentId
  ? await tx.comment.findUnique({
      where: { id: parentId },
      select: { authorId: true },
    })
  : await tx.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

if (recipient && recipient.authorId !== user.id) {
  const notificationEnabled = await tx.user.findUnique({
    where: { id: recipient.authorId },
    select: { notifyReplies: true },
  });

  if (notificationEnabled?.notifyReplies) {
    await tx.notification.create({
      data: {
        userId: recipient.authorId,
        type: "REPLY",
        postId,
        commentId: comment.id,
        message: "Someone replied to your post.",
        quote: commentBody.slice(0, 150),
      },
    });
  }
}


      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          replyCount: {
            increment: 1,
          },
        },
      });

      return {
        comment,
      };
    });

    if ("error" in result) {
      if (result.error === "POST_NOT_FOUND") {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Parent comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Comment created successfully",
        comment: result.comment,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("CREATE_COMMENT_ERROR:", error);

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
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const validation = getCommentsQuerySchema.safeParse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { cursor, limit } = validation.data;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: "VISIBLE",
        parentId: null,
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [
        { createdAt: "asc" },
        { id: "asc" },
      ],
      select: {
        id: true,
        body: true,
        createdAt: true,
        replies: {
          where: {
            status: "VISIBLE",
          },
          orderBy: [
            { createdAt: "asc" },
            { id: "asc" },
          ],
          select: {
            id: true,
            body: true,
            parentId: true,
            createdAt: true,
          },
        },
      },
    });

    const hasMore = comments.length > limit;

    const data = hasMore
      ? comments.slice(0, limit)
      : comments;

    const nextCursor = hasMore
      ? data[data.length - 1].id
      : null;

    return NextResponse.json({
      comments: data,
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("GET_COMMENTS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


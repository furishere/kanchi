
import { NextRequest, NextResponse } from "next/server";

import { getFeedPreferences } from "@/lib/posts/feed-preferences";

import { prisma } from "@/lib/prisma";
import { updatePostSchema } from "@/lib/validations/post";
import { getCurrentUser } from "@/lib/auth/auth";
import { csrfError, validateOrigin } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();
    const preferences = await getFeedPreferences(user?.id);

    const post = await prisma.post.findFirst({
      where: {
        id,
        status: "VISIBLE",
        mood: {
          notIn: preferences.hiddenMoods,
        },
        authorId: {
          notIn: preferences.mutedUserIds,
        },
      },
      select: {
        id: true,
        body: true,
        mood: true,
        contentWarning: true,
        status: true,
        feltCount: true,
        warmCount: true,
        replyCount: true,
        createdAt: true,

        _count: {
          select: {
            savedBy: true,
          },
        },

        ...(user && {
          savedBy: {
            where: {
              userId: user.id,
            },
            select: {
              userId: true,
            },
            take: 1,
          },
        }),
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const { _count, ...postData } = post;

    const savedBy = "savedBy" in post
      ? post.savedBy
      : [];

    return NextResponse.json({
      post: {
        ...postData,
        savedCount: _count.savedBy,
        isSaved: savedBy.length > 0,
        shouldBlur: Boolean(
          preferences.blurCw && post.contentWarning
        ),
      },
    });
  } catch (error) {
    console.error("GET_POST_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
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

    const { id } = await context.params;

    const body = await request.json();

    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid post data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId: user.id,
        status: "VISIBLE",
      },
      select: {
        id: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: validation.data,
      select: {
        id: true,
        body: true,
        mood: true,
        contentWarning: true,
        status: true,
        feltCount: true,
        warmCount: true,
        replyCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("UPDATE_POST_ERROR:", error);

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

    const { id } = await context.params;

    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId: user.id,
        status: {
          not: "REMOVED",
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: "REMOVED",
      },
    });

    return NextResponse.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_POST_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

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

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        status: "VISIBLE",
      },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const savedPost = await prisma.savedPost.upsert({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
      create: {
        userId: user.id,
        postId,
      },
      update: {},
      select: {
        userId: true,
        postId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Post saved successfully",
      saved: true,
      savedPost,
    });
  } catch (error) {
    console.error("SAVE_POST_ERROR:", error);

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

    const { id: postId } = await context.params;

    const result = await prisma.savedPost.deleteMany({
      where: {
        userId: user.id,
        postId,
      },
    });

    return NextResponse.json({
      message: "Post removed from saved posts",
      saved: false,
      deleted: result.count > 0,
    });
  } catch (error) {
    console.error("UNSAVE_POST_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

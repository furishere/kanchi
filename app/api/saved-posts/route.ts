
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") ?? 20), 1),
      50
    );

    const cursor = searchParams.get("cursor");

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: user.id,
        post: {
          status: "VISIBLE",
        },
      },
      take: limit + 1,
      ...(cursor && {
        cursor: {
          userId_postId: {
            userId: user.id,
            postId: cursor,
          },
        },
        skip: 1,
      }),
      orderBy: [
        { createdAt: "desc" },
        { postId: "desc" },
      ],
      select: {
        createdAt: true,
        post: {
          select: {
            id: true,
            body: true,
            mood: true,
            contentWarning: true,
            feltCount: true,
            warmCount: true,
            replyCount: true,
            createdAt: true,
          },
        },
      },
    });

    const hasMore = savedPosts.length > limit;

    const data = hasMore
      ? savedPosts.slice(0, limit)
      : savedPosts;

    return NextResponse.json({
      savedPosts: data,
      pagination: {
        hasMore,
        nextCursor: hasMore
          ? data[data.length - 1].post.id
          : null,
      },
    });
  } catch (error) {
    console.error("GET_SAVED_POSTS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { getFeedPreferences } from "@/lib/posts/feed-preferences";

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

    const rawLimit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    const limit = rawLimit === null ? 20 : Number(rawLimit);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      return NextResponse.json(
        {
          message: "Invalid limit. Use a number between 1 and 50.",
        },
        { status: 400 }
      );
    }

    const preferences = await getFeedPreferences(user.id);

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: user.id,
        post: {
          status: "VISIBLE",
          ...(preferences.hiddenMoods.length > 0 && {
            mood: {
              notIn: preferences.hiddenMoods,
            },
          }),
          authorId: {
            notIn: preferences.mutedUserIds,
          },
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

            _count: {
              select: {
                savedBy: true,
              },
            },
          },
        },
      },
    });

    // Pagination
    const hasMore = savedPosts.length > limit;

    const paginatedPosts = hasMore
      ? savedPosts.slice(0, limit)
      : savedPosts;

    // Format response
    const data = paginatedPosts.map((saved) => ({
      savedAt: saved.createdAt,
      ...saved.post,
      savedCount: saved.post._count.savedBy,
      isSaved: true,
      shouldBlur:
        preferences.blurCw &&
        Boolean(saved.post.contentWarning),
    }));

    const nextCursor = hasMore
      ? data[data.length - 1]?.id ?? null
      : null;

    return NextResponse.json({
      savedPosts: data,
      pagination: {
        hasMore,
        nextCursor,
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


import { NextRequest, NextResponse } from "next/server";

import { paginateResults } from "@/lib/utils/pagination";

import { getFeedPreferences } from "@/lib/posts/feed-preferences";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { explorePostsQuerySchema } from "@/lib/validations/post";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validation =
      explorePostsQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { cursor, limit, mood, sort } = validation.data;

    const user = await getCurrentUser();

    const preferences = await getFeedPreferences(user?.id);

    const hiddenMoodRequested =
      mood !== undefined &&
      preferences.hiddenMoods.includes(mood);

    const where = {
      status: "VISIBLE" as const,

      ...(hiddenMoodRequested && {
        id: "__no_matching_post__",
      }),

      ...(!hiddenMoodRequested &&
        preferences.hiddenMoods.length > 0 && {
          mood: {
            notIn: preferences.hiddenMoods,
          },
        }),

      ...(mood && !hiddenMoodRequested && { mood }),

      ...(preferences.mutedUserIds.length > 0 && {
        authorId: {
          notIn: preferences.mutedUserIds,
        },
      }),
    };

    const orderBy =
      sort === "trending"
        ? [
            { feltCount: "desc" as const },
            { createdAt: "desc" as const },
            { id: "desc" as const },
          ]
        : [
            { createdAt: "desc" as const },
            { id: "desc" as const },
          ];

    const posts = await prisma.post.findMany({
      where,

      take: limit + 1,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      orderBy,

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

    
const pagination = paginateResults(posts, limit);


    
const formattedPosts = pagination.data.map((post) => {
  const { _count, ...postData } = post;

  const savedBy = "savedBy" in post
    ? post.savedBy
    : [];

  return {
    ...postData,
    savedCount: _count.savedBy,
    isSaved: savedBy.length > 0,
    shouldBlur: Boolean(
      preferences.blurCw && post.contentWarning
    ),
  };
});


    
return NextResponse.json({
  success: true,
  posts: formattedPosts,
  pagination: {
    hasMore: pagination.hasMore,
    nextCursor: pagination.nextCursor,
  },
});

  } catch (error) {
    console.error("Explore error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch explore posts",
      },
      { status: 500 }
    );
  }
}

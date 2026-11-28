
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { paginateResults } from "@/lib/utils/pagination";
import { getFeedPreferences } from "@/lib/posts/feed-preferences";

const profileQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const validation = profileQuerySchema.safeParse({
      cursor: request.nextUrl.searchParams.get("cursor") ?? undefined,
      limit: request.nextUrl.searchParams.get("limit") ?? undefined,
    });

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

    const { cursor, limit } = validation.data;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [userData, confessionCount, feltAggregate, repliesGiven, moodGroups, posts, preferences] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        }),

        prisma.post.count({
          where: {
            authorId: user.id,
            status: { not: "REMOVED" },
          },
        }),

        prisma.post.aggregate({
          where: {
            authorId: user.id,
            status: { not: "REMOVED" },
          },
          _sum: { feltCount: true },
        }),

        prisma.comment.count({
          where: {
            authorId: user.id,
            status: "VISIBLE",
          },
        }),

        prisma.post.groupBy({
          by: ["mood"],
          where: {
            authorId: user.id,
            status: { not: "REMOVED" },
            createdAt: { gte: thirtyDaysAgo },
          },
          _count: { mood: true },
        }),

        prisma.post.findMany({
          where: {
            authorId: user.id,
            status: { not: "REMOVED" },
          },
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
          take: limit + 1,
          orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
          ],
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
            _count: {
              select: { savedBy: true },
            },
            savedBy: {
              where: {
                userId: user.id,
              },
              select: {
                userId: true,
              },
            },
          },
        }),

        getFeedPreferences(user.id),
      ]);

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const pagination = paginateResults(posts, limit);

    const moodBreakdown = moodGroups
      .map((group) => ({
        mood: group.mood,
        count: group._count.mood,
      }))
      .sort((a, b) => b.count - a.count);

    const totalMoodPosts = moodBreakdown.reduce(
      (total, mood) => total + mood.count,
      0
    );

    const formattedPosts = pagination.data.map((post) => ({
      id: post.id,
      body: post.body,
      mood: post.mood,
      contentWarning: post.contentWarning,
      status: post.status,
      feltCount: post.feltCount,
      warmCount: post.warmCount,
      replyCount: post.replyCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      savedCount: post._count.savedBy,
      isSaved: post.savedBy.length > 0,
      shouldBlur:
        preferences.blurCw &&
        Boolean(post.contentWarning),
    }));

    return NextResponse.json({
      success: true,
      profile: {
        username: userData.username,

        stats: {
          confessions: confessionCount,
          feltCount: feltAggregate._sum.feltCount ?? 0,
          repliesGiven,
        },

        moods: {
          period: "30 days",
          total: totalMoodPosts,
          breakdown: moodBreakdown.map((mood) => ({
            ...mood,
            percentage:
              totalMoodPosts === 0
                ? 0
                : Math.round(
                    (mood.count / totalMoodPosts) * 100
                  ),
          })),
        },

        posts: formattedPosts,

        pagination: {
          hasMore: pagination.hasMore,
          nextCursor: pagination.nextCursor,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

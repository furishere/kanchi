
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth/moderator";

export async function GET(request: NextRequest) {
  try {
    const { user, response } = await requireModerator();

    if (!user) return response;

    const searchParams = request.nextUrl.searchParams;

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") ?? 20), 1),
      50
    );

    const cursor = searchParams.get("cursor");

    const reports = await prisma.report.findMany({
      where: {
        status: "OPEN",
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,

        post: {
          select: {
            id: true,
            body: true,
            mood: true,
            status: true,
          },
        },

        comment: {
          select: {
            id: true,
            body: true,
            status: true,
            postId: true,
          },
        },
      },
    });

    const hasMore = reports.length > limit;

    const data = hasMore
      ? reports.slice(0, limit)
      : reports;

    return NextResponse.json({
      reports: data,
      pagination: {
        hasMore,
        nextCursor: hasMore
          ? data[data.length - 1].id
          : null,
      },
    });
  } catch (error) {
    console.error("GET_MOD_REPORTS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

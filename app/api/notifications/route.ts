
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

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
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
        type: true,
        postId: true,
        commentId: true,
        count: true,
        message: true,
        quote: true,
        read: true,
        createdAt: true,
      },
    });

    const hasMore = notifications.length > limit;

    const data = hasMore
      ? notifications.slice(0, limit)
      : notifications;

    return NextResponse.json({
      notifications: data,
      pagination: {
        hasMore,
        nextCursor: hasMore
          ? data[data.length - 1].id
          : null,
      },
    });
  } catch (error) {
    console.error("GET_NOTIFICATIONS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

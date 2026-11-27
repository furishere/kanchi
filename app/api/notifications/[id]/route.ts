
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{ id: string }>;
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

    const result = await prisma.notification.updateMany({
      where: {
        id,
        userId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    if (result.count === 0) {
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!notification) {
        return NextResponse.json(
          { message: "Notification not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("MARK_NOTIFICATION_READ_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

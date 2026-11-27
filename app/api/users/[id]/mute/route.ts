
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

    const { id: mutedUserId } = await context.params;

    if (mutedUserId === user.id) {
      return NextResponse.json(
        { message: "You cannot mute yourself" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: mutedUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await prisma.mute.upsert({
      where: {
        userId_mutedUserId: {
          userId: user.id,
          mutedUserId,
        },
      },
      create: {
        userId: user.id,
        mutedUserId,
      },
      update: {},
    });

    return NextResponse.json({
      message: "User muted successfully",
      muted: true,
    });
  } catch (error) {
    console.error("MUTE_USER_ERROR:", error);

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

    const { id: mutedUserId } = await context.params;

    const result = await prisma.mute.deleteMany({
      where: {
        userId: user.id,
        mutedUserId,
      },
    });

    return NextResponse.json({
      message: "User unmuted successfully",
      muted: false,
      deleted: result.count > 0,
    });
  } catch (error) {
    console.error("UNMUTE_USER_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

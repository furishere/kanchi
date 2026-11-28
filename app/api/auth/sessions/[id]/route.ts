
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{ id: string }>;
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
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const session = await prisma.session.findFirst({
      where: {
        id,
        userId: user.id,
        revokedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found",
        },
        { status: 404 }
      );
    }

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error("Revoke session error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to revoke session",
      },
      { status: 500 }
    );
  }
}

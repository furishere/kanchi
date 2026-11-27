
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAccessToken, clearAuthCookies } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/token";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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

    const { id } = await context.params;

    const result = await prisma.session.updateMany({
      where: {
        id,
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    const accessToken = await getAccessToken();
    const payload = accessToken
      ? await verifyAccessToken(accessToken)
      : null;

    const response = NextResponse.json({
      message: "Session revoked successfully",
    });

    if (payload?.sessionId === id) {
      await clearAuthCookies();
    }

    return response;
  } catch (error) {
    console.error("REVOKE_SESSION_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid access token",
        },
        { status: 401 },
      );
    }

    const currentSession = await prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    if (!currentSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Session expired or revoked",
        },
        { status: 401 },
      );
    }

    const { sessionId } = await context.params;

    if (sessionId === currentSession.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Use the logout endpoint to revoke your current session",
        },
        { status: 400 },
      );
    }

    const revokedSession = await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (revokedSession.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found or already revoked",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Session revoked successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Revoke session error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

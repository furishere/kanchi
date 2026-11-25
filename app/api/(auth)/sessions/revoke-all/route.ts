
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAccessToken, clearAuthCookies } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

export async function POST() {
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
      await clearAuthCookies();

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
      await clearAuthCookies();

      return NextResponse.json(
        {
          success: false,
          message: "Session expired or revoked",
        },
        { status: 401 },
      );
    }

    const result = await prisma.session.updateMany({
      where: {
        userId: payload.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await clearAuthCookies();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out from all devices successfully",
        revokedSessions: result.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Revoke all sessions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

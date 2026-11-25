
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

export async function GET() {
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

    const sessions = await prisma.session.findMany({
      where: {
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        sessions: sessions.map((session) => ({
          ...session,
          isCurrent: session.id === currentSession.id,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get sessions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

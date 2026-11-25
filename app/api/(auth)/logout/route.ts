
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getAccessToken,
  clearAuthCookies,
} from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

export async function POST() {
  try {
    const accessToken = await getAccessToken();

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);

      if (payload) {
        await prisma.session.updateMany({
          where: {
            id: payload.sessionId,
            userId: payload.userId,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      }
    }

    await clearAuthCookies();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);

    await clearAuthCookies();

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

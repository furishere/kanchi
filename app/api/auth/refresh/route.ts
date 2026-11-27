
import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies, getRefreshToken, setAuthCookies } from "@/lib/auth/cookie";
import {
  verifyRefreshToken,
  createAccessToken,
} from "@/lib/auth/token";
import { rotateRefreshToken } from "@/lib/auth/session";
import { csrfError, validateOrigin } from "@/lib/auth/csrf";

export async function POST(request : NextRequest) {
  if (!validateOrigin(request)) {
    return csrfError();
  }

  try {
    const oldRefreshToken = await getRefreshToken();

    if (!oldRefreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token missing",
        },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(oldRefreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired refresh token",
        },
        { status: 401 }
      );
    }

    const newRefreshToken = await rotateRefreshToken(
      payload.sessionId,
      payload.userId,
      oldRefreshToken
    );

    if (!newRefreshToken) {
      await clearAuthCookies();
      return NextResponse.json(
        {
          success: false,
          message: "Session expired or revoked",
        },
        { status: 401 }
      );
    }

    const newAccessToken = await createAccessToken({
      userId: payload.userId,
      sessionId: payload.sessionId,
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";

import { getAccessToken, clearAuthCookies } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/token";
import { revokeSession } from "@/lib/auth/session";
import { csrfError, validateOrigin } from "@/lib/auth/csrf";

export async function POST(request: NextRequest) {
    if (!validateOrigin(request)) {
    return csrfError();
  }
  try {
    const accessToken = await getAccessToken();

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);

      if (payload) {
        await revokeSession(payload.sessionId);
      }
    }

    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

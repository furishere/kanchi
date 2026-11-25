import { NextResponse } from "next/server";
import { isTrustedOrigin } from "@/lib/auth/csrf";

import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookie";
import { refreshSession } from "@/lib/auth/refresh.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
  return NextResponse.json(
    {
      success: false,
      message: "Forbidden: Invalid request origin",
    },
    { status: 403 },
  );
}
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is missing",
        },
        { status: 401 },
      );
    }

    const result = await refreshSession(refreshToken);

    if (!result.success) {
      await clearAuthCookies();

      return NextResponse.json(
        {
          success: false,
          message:
            result.reason === "REUSED"
              ? "Refresh token reuse detected. Please log in again."
              : "Invalid or expired refresh token",
        },
        { status: 401 },
      );
    }

    await setAuthCookies(
      result.accessToken,
      result.refreshToken,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Tokens refreshed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Refresh error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
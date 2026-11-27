
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/auth";
import { revokeAllUserSessions } from "@/lib/auth/session";
import { clearAuthCookies } from "@/lib/auth/cookie";
import { csrfError, validateOrigin } from "@/lib/auth/csrf";

export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return csrfError();
  }
  try {
    const user = await getCurrentUser();

    if (!user) {
      await clearAuthCookies();

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await revokeAllUserSessions(user.id);

    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

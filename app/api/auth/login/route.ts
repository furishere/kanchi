
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { createAccessToken } from "@/lib/auth/token";
import { setAuthCookies } from "@/lib/auth/cookie";
import { loginSchema } from "@/lib/auth/validation";
import { csrfError, validateOrigin } from "@/lib/auth/csrf";
import { rateLimit } from "@/lib/auth/rate-limit";
import { AUTH_RATE_LIMITS } from "@/lib/auth/rate-limit-config";

export async function POST(request: NextRequest) {
    if (!validateOrigin(request)) {
    return csrfError();
  }
  const ip =
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

const result = await rateLimit({
  key: `login:${ip}`,
  ...AUTH_RATE_LIMITS.login,
});

if (!result.success) {
  return NextResponse.json(
    {
      success: false,
      message: "Too many login attempts. Try again later.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(
          1,
          Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
        ).toString(),
      },
    }
  );
}
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, password } = result.data;
  
    const accountLimit = await rateLimit({
  key: `login:account:${username.toLowerCase()}`,
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

if (!accountLimit.success) {
  return NextResponse.json(
    {
      success: false,
      message: "Too many login attempts. Try again later.",
    },
    { status: 429 }
  );
}

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    

    const { session, refreshToken } = await createSession({
      userId: user.id,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        undefined,
    });

    const accessToken = await createAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

import { loginUser } from "@/lib/auth/auth.servvice";
import { setAuthCookies } from "@/lib/auth/cookie";
import { loginSchema } from "@/lib/auth/password";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const userAgent =
      request.headers.get("user-agent") ?? undefined;

    const ipAddress =
      request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() ?? undefined;

    const result = await loginUser(validation.data, {
      userAgent,
      ipAddress,
    });

    await setAuthCookies(
      result.accessToken,
      result.refreshToken,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: result.user,
      },
      { status: 200 },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 },
      );
    }

    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
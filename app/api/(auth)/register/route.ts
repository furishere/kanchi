import { registerUser } from "@/lib/auth/auth.servvice";
import { setAuthCookies } from "@/lib/auth/cookie";
import { registerSchema } from "@/lib/auth/password";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;

    const ipAddress =
      request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() ?? undefined;

    const result = await registerUser(validation.data, {
      userAgent,
      ipAddress,
    });

    await setAuthCookies(
      result.accessToken,
      result.refreshToken
    );

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
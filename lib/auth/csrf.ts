
import { NextRequest, NextResponse } from "next/server";

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  const expectedOrigin =
    process.env.APP_ORIGIN ?? request.nextUrl.origin;

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(expectedOrigin).origin;
  } catch {
    return false;
  }
}

export function csrfError() {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid request origin",
    },
    { status: 403 }
  );
}
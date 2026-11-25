
import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/authenticate";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}


import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";

export async function requireModerator() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "MOD") {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

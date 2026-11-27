
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const mutedUsers = await prisma.mute.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
        mutedUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      mutedUsers,
    });
  } catch (error) {
    console.error("GET_MUTED_USERS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

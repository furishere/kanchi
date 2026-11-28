
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sessions",
      },
      { status: 500 }
    );
  }
}

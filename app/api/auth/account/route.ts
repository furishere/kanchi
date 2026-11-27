
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { verifyPassword } from "@/lib/auth/password";
import { clearAuthCookies } from "@/lib/auth/cookie";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

const deleteAccountSchema = z.object({
  password: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return csrfError();
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = deleteAccountSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await verifyPassword(
      validation.data.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    await clearAuthCookies();

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";
import { clearAuthCookies } from "@/lib/auth/cookie";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .refine(
      (password) => new TextEncoder().encode(password).length <= 72,
      "Password must not exceed 72 bytes"
    ),
});

export async function POST(request: NextRequest) {
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
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

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
      currentPassword,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const isSamePassword = await verifyPassword(
      newPassword,
      existingUser.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),

      prisma.session.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    await clearAuthCookies();

    return NextResponse.json({
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

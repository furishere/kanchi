
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";
import { updateSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const settings = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        notifyReplies: true,
        notifyReactions: true,
        quietHours: true,
        blurCw: true,
        hiddenMoods: true,
      },
    });

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch settings",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return csrfError();
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

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

    
    const validation = updateSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid settings",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { quietHours, ...otherSettings } = validation.data;

    const updateData: Prisma.UserUpdateInput = {
      ...otherSettings,

      ...(quietHours !== undefined && {
        quietHours:
          quietHours === null
            ? Prisma.DbNull
            : (quietHours as Prisma.InputJsonValue),
      }),
    };

    const settings = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
      select: {
        notifyReplies: true,
        notifyReactions: true,
        quietHours: true,
        blurCw: true,
        hiddenMoods: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
      },
      { status: 500 }
    );
  }
}

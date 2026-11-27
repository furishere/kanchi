
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";
import { createReportSchema } from "@/lib/validations/report";

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

    const validation = createReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid report data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { postId, commentId, reason } = validation.data;

    if (postId) {
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
          status: "VISIBLE",
        },
        select: { id: true },
      });

      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 }
        );
      }
    }

    if (commentId) {
      const comment = await prisma.comment.findFirst({
        where: {
          id: commentId,
          status: "VISIBLE",
        },
        select: { id: true },
      });

      if (!comment) {
        return NextResponse.json(
          { message: "Comment not found" },
          { status: 404 }
        );
      }
    }

   
const report = await prisma.$transaction(async (tx) => {
  const createdReport = await tx.report.create({
    data: {
      reporterId: user.id,
      postId: postId ?? null,
      commentId: commentId ?? null,
      reason,
    },
  });

  const moderators = await tx.user.findMany({
    where: {
      role: "MOD",
    },
    select: {
      id: true,
    },
  });

  if (moderators.length > 0) {
    await tx.notification.createMany({
      data: moderators.map((moderator) => ({
        userId: moderator.id,
        type: "MOD",
        postId: postId ?? null,
        commentId: commentId ?? null,
        message: "A new report has been submitted.",
        quote: `Report reason: ${reason}`,
      })),
    });
  }

  return createdReport;
});


    return NextResponse.json(
      {
        message: "Report submitted successfully",
        report,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "You have already reported this content" },
        { status: 409 }
      );
    }

    console.error("CREATE_REPORT_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

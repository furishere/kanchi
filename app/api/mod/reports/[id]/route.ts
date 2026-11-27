
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth/moderator";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const resolveReportSchema = z.object({
  hideContent: z.boolean().default(false),
});

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!validateOrigin(request)) {
      return csrfError();
    }

    const { user, response } = await requireModerator();

    if (!user) return response;

    const { id } = await context.params;

    const body = await request.json();

    const validation = resolveReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { hideContent } = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          postId: true,
          commentId: true,
        },
      });

      if (!report) {
        return { error: "NOT_FOUND" as const };
      }

      if (report.status !== "OPEN") {
        return { error: "ALREADY_RESOLVED" as const };
      }

      if (hideContent && report.postId) {
        await tx.post.updateMany({
          where: {
            id: report.postId,
            status: "VISIBLE",
          },
          data: {
            status: "HIDDEN",
          },
        });
      }

      if (hideContent && report.commentId) {
        await tx.comment.updateMany({
          where: {
            id: report.commentId,
            status: "VISIBLE",
          },
          data: {
            status: "HIDDEN",
          },
        });
      }

      const updatedReport = await tx.report.update({
        where: { id },
        data: {
          status: "RESOLVED",
        },
        select: {
          id: true,
          reason: true,
          status: true,
          postId: true,
          commentId: true,
          updatedAt: true,
        },
      });

      return {
        report: updatedReport,
      };
    });

    if ("error" in result) {
      return NextResponse.json(
        {
          message:
            result.error === "NOT_FOUND"
              ? "Report not found"
              : "Report already resolved",
        },
        {
          status: result.error === "NOT_FOUND" ? 404 : 409,
        }
      );
    }

    return NextResponse.json({
      message: "Report resolved successfully",
      report: result.report,
      contentHidden: hideContent,
    });
  } catch (error) {
    console.error("RESOLVE_REPORT_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

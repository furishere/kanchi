
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { createPostSchema, getPostsQuerySchema } from "@/lib/validations/post";
import { validateOrigin, csrfError } from "@/lib/auth/csrf";

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

    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid post data",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { body: postBody, mood, contentWarning } = validation.data;

    const post = await prisma.post.create({
      data: {
        body: postBody,
        mood,
        contentWarning: contentWarning || null,
        authorId: user.id,
      },
      select: {
        id: true,
        body: true,
        mood: true,
        contentWarning: true,
        status: true,
        feltCount: true,
        warmCount: true,
        replyCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_POST_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const validation = getPostsQuerySchema.safeParse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      mood: searchParams.get("mood") ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { cursor, limit, mood } = validation.data;

    const posts = await prisma.post.findMany({
      where: {
        status: "VISIBLE",
        ...(mood && { mood }),
      },

      take: limit + 1,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],

      select: {
        id: true,
        body: true,
        mood: true,
        contentWarning: true,
        feltCount: true,
        warmCount: true,
        replyCount: true,
        createdAt: true,
      },
    });

    const hasMore = posts.length > limit;

    const data = hasMore
      ? posts.slice(0, limit)
      : posts;

    const nextCursor = hasMore
      ? data[data.length - 1].id
      : null;

    return NextResponse.json({
      posts: data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("GET_POSTS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./cookie";
import { verifyAccessToken } from "./jwt";

export async function getAuthContext() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return null;
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return null;
    }

    const session = await prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!session) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      user,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const auth = await getAuthContext();

  return auth?.user ?? null;
}

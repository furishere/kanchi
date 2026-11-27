
import { prisma } from "@/lib/prisma";

import { getAccessToken } from "@/lib/auth/cookie";
import { verifyAccessToken } from "@/lib/auth/token";
import { validateSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    return null;
  }

  const session = await validateSession(
    payload.sessionId,
    payload.userId
  );

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

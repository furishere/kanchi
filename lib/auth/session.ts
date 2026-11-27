
import { createHash, randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";
import {
  createRefreshToken,
  type TokenPayload,
} from "@/lib/auth/token";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface CreateSessionInput {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export async function createSession({
  userId,
  userAgent,
  ipAddress,
}: CreateSessionInput) {
  const sessionId = randomUUID();

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY
  );

  const payload: TokenPayload = {
    userId,
    sessionId,
  };

  const refreshToken = await createRefreshToken(payload);

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return {
    session,
    refreshToken,
  };
}

export async function validateSession(
  sessionId: string,
  userId: string
) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

export async function revokeSession(sessionId: string) {
  await prisma.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllUserSessions(userId: string) {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}


export async function rotateRefreshToken(
  sessionId: string,
  userId: string,
  oldRefreshToken: string
) {
  const newRefreshToken = await createRefreshToken({
    userId,
    sessionId,
  });

  const oldHash = hashRefreshToken(oldRefreshToken);
  const newHash = hashRefreshToken(newRefreshToken);

  const now = new Date();

  const result = await prisma.session.updateMany({
    where: {
      id: sessionId,
      userId,
      refreshTokenHash: oldHash,
      revokedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    data: {
      refreshTokenHash: newHash,
    },
  });

  if (result.count === 1) {
    return newRefreshToken;
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      refreshTokenHash: true,
      revokedAt: true,
      expiresAt: true,
      userId: true,
    },
  });

  if (
    session &&
    session.userId === userId &&
    session.revokedAt === null &&
    session.expiresAt > now &&
    session.refreshTokenHash !== oldHash
  ) {
    await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  return null;
}

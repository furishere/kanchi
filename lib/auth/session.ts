import { prisma } from "../prisma";
import { generateRefreshToken, hashRefreshToken } from "./token";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

interface CreateSessionInput {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export async function createSession(input: CreateSessionInput) {
  const refreshToken = generateRefreshToken();

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY
  );

  const session = await prisma.session.create({
    data: {
      userId: input.userId,
      refreshTokenHash,
      expiresAt,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
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
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return session;
}

export async function revokeSession(sessionId: string) {
  return prisma.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllSessions(userId: string) {
  return prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function getActiveSessions(userId: string) {
  return prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
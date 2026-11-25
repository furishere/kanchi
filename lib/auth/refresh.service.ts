
import { prisma } from "@/lib/prisma";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "./token";
import { signAccessToken } from "./jwt";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

type RefreshResult =
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
    }
  | {
      success: false;
      reason: "INVALID" | "REUSED";
    };

type RefreshTransactionResult =
  | {
      success: true;
      userId: string;
      sessionId: string;
    }
  | {
      success: false;
      reason: "INVALID" | "REUSED";
    };

export async function refreshSession(
  incomingRefreshToken: string,
): Promise<RefreshResult> {
  const incomingHash = hashRefreshToken(incomingRefreshToken);

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const now = new Date();

  const newExpiresAt = new Date(
    now.getTime() + REFRESH_TOKEN_EXPIRY,
  );

  const result: RefreshTransactionResult = await prisma.$transaction(
    async (tx): Promise<RefreshTransactionResult> => {
      const storedToken = await tx.refreshToken.findUnique({
        where: {
          tokenHash: incomingHash,
        },
        include: {
          session: true,
        },
      });

      if (!storedToken) {
        return {
          success: false,
          reason: "INVALID",
        };
      }

      const session = storedToken.session;

      if (storedToken.usedAt !== null) {
        await tx.session.updateMany({
          where: {
            id: session.id,
            revokedAt: null,
          },
          data: {
            revokedAt: now,
          },
        });

        return {
          success: false,
          reason: "REUSED",
        };
      }

      if (
        storedToken.expiresAt <= now ||
        session.expiresAt <= now ||
        session.revokedAt !== null ||
        session.refreshTokenHash !== incomingHash
      ) {
        return {
          success: false,
          reason: "INVALID",
        };
      }

      const consumed = await tx.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          usedAt: null,
        },
        data: {
          usedAt: now,
        },
      });

      if (consumed.count !== 1) {
        await tx.session.updateMany({
          where: {
            id: session.id,
            revokedAt: null,
          },
          data: {
            revokedAt: now,
          },
        });

        return {
          success: false,
          reason: "REUSED",
        };
      }

      const updatedSession = await tx.session.updateMany({
        where: {
          id: session.id,
          refreshTokenHash: incomingHash,
          revokedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newExpiresAt,
        },
      });

      if (updatedSession.count !== 1) {
        await tx.session.updateMany({
          where: {
            id: session.id,
            revokedAt: null,
          },
          data: {
            revokedAt: now,
          },
        });

        return {
          success: false,
          reason: "REUSED",
        };
      }

      await tx.refreshToken.create({
        data: {
          sessionId: session.id,
          tokenHash: newRefreshTokenHash,
          expiresAt: newExpiresAt,
        },
      });

      return {
        success: true,
        userId: session.userId,
        sessionId: session.id,
      };
    },
    {
      maxWait: 10000,
      timeout: 15000,
    },
  );

  if (!result.success) {
    return result;
  }

  const accessToken = await signAccessToken({
    userId: result.userId,
    sessionId: result.sessionId,
  });

  return {
    success: true,
    accessToken,
    refreshToken: newRefreshToken,
  };
}

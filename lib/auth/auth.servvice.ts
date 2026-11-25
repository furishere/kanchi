
import { prisma } from "../prisma";

import { hashPassword, verfiyPassword } from "./password";
import { signAccessToken } from "./jwt";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "./token";

import type {
  LoginInput,
  RegisterInput,
} from "./password";

const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;

interface AuthOptions {
  userAgent?: string;
  ipAddress?: string;
}

export async function registerUser(
  input: RegisterInput,
  options: AuthOptions = {},
) {
  const { username, password } = input;

  const hashedPassword = await hashPassword(password);

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);

  const result = await prisma.$transaction(
    async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });

      const session = await tx.session.create({
        data: {
          userId: user.id,
          refreshTokenHash,
          expiresAt,
          userAgent: options.userAgent,
          ipAddress: options.ipAddress,
        },
        select: {
          id: true,
          expiresAt: true,
        },
      });

      await tx.refreshToken.create({
        data: {
          sessionId: session.id,
          tokenHash: refreshTokenHash,
          expiresAt,
        },
      });

      return {
        user,
        session,
      };
    },
    {
      maxWait: 10000,
      timeout: 15000,
    },
  );

  const accessToken = await signAccessToken({
    userId: result.user.id,
    sessionId: result.session.id,
  });

  return {
    user: result.user,
    accessToken,
    refreshToken,
  };
}

export async function loginUser(
  input: LoginInput,
  options: AuthOptions = {},
) {
  const { username, password } = input;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await verfiyPassword(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);

  const session = await prisma.$transaction(
    async (tx) => {
      const newSession = await tx.session.create({
        data: {
          userId: user.id,
          refreshTokenHash,
          expiresAt,
          userAgent: options.userAgent,
          ipAddress: options.ipAddress,
        },
        select: {
          id: true,
          expiresAt: true,
        },
      });

      await tx.refreshToken.create({
        data: {
          sessionId: newSession.id,
          tokenHash: refreshTokenHash,
          expiresAt,
        },
      });

      return newSession;
    },
    {
      maxWait: 10000,
      timeout: 15000,
    },
  );

  const accessToken = await signAccessToken({
    userId: user.id,
    sessionId: session.id,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

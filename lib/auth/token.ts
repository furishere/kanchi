
import { SignJWT, jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing");
}

const accessSecret = new TextEncoder().encode(
  ACCESS_TOKEN_SECRET
);

const refreshSecret = new TextEncoder().encode(
  REFRESH_TOKEN_SECRET
);

export interface TokenPayload {
  userId: string;
  sessionId: string;
}

export async function createAccessToken(
  payload: TokenPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    sessionId: payload.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

export async function createRefreshToken(
  payload: TokenPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    sessionId: payload.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}

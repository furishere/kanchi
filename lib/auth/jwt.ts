import {SignJWT, jwtVerify} from "jose"
const secret = process.env.ACCESS_TOKEN_SECRET

if(!secret){
    throw new Error("ACCESS_TOKEN_SECRET is not configured")
}

const JWT_SECRET = new TextEncoder().encode(secret)

export interface AccessTokenPayload {
    userId : string,
    sessionId : string
}

export async function signAccessToken(
    payload : AccessTokenPayload
) : Promise<string> {
    return new SignJWT({
        sessionId:payload.sessionId
    })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("kanchi")
    .setAudience("kanchi-app")
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "kanchi",
      audience: "kanchi-app",
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}
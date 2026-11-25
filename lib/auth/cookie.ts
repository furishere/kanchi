import { cookies } from "next/headers";

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_COOKIE = "kanchi_access_token";
const REFRESH_TOKEN_COOKIE = "kanchi_refresh_token";

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
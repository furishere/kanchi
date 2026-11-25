
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.APP_ORIGIN;

  if (!origin || !configuredOrigin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(configuredOrigin).origin;
  } catch {
    return false;
  }
}

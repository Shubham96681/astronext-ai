/** Client-side JWT helpers (decode only — verification happens on the API). */

export type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
  type?: 'access' | 'refresh';
  exp?: number;
  iat?: number;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

export function tokenExpiresInMs(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000 - Date.now();
}

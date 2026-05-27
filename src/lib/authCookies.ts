export const ACCESS_COOKIE = 'astronext_access_token';
export const REFRESH_COOKIE = 'astronext_refresh_token';

function maxAgeSeconds(days: number): number {
  return days * 24 * 60 * 60;
}

/** Sets cookies readable by middleware (SameSite=Lax, not HttpOnly so client can sync). */
export function setAuthCookies(accessToken: string, refreshToken: string, expiresInSeconds: number) {
  if (typeof document === 'undefined') return;
  const accessMax = Math.max(60, expiresInSeconds);
  const refreshMax = maxAgeSeconds(7);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${accessMax}; SameSite=Lax${secure}`;
  document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; Path=/; Max-Age=${refreshMax}; SameSite=Lax${secure}`;
}

export function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_COOKIE}=; Path=/; Max-Age=0`;
  document.cookie = `${REFRESH_COOKIE}=; Path=/; Max-Age=0`;
}

export function getAccessTokenFromDocumentCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ACCESS_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

import { ApiError } from '@/lib/api';
import { clearAuthCookies, setAuthCookies } from '@/lib/authCookies';
import { isTokenExpired } from '@/lib/jwt';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const TOKEN_KEY = 'astronext_token';
export const REFRESH_KEY = 'astronext_refresh_token';
export const USER_KEY = 'astronext_user';

export type UserRole = 'customer' | 'astrologer' | 'admin' | 'ops';

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  role: UserRole;
  user_id: number;
  name: string;
  email: string;
  redirect_to: string;
};

export function persistSession(tokens: TokenResponse) {
  const user: AuthUser = {
    id: tokens.user_id,
    email: tokens.email,
    name: tokens.name,
    role: tokens.role,
  };
  localStorage.setItem(TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthCookies(tokens.access_token, tokens.refresh_token, tokens.expires_in);
  return user;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  clearAuthCookies();
}

export function getStoredTokens(): { access: string | null; refresh: string | null } {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  return {
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export async function loginRequest(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.detail ?? 'Login failed', res.status);
  }
  return res.json() as Promise<TokenResponse>;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.detail ?? 'Registration failed', res.status);
  }
  return res.json() as Promise<TokenResponse>;
}

export async function refreshTokensRequest(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.detail ?? 'Session expired', res.status);
  }
  return res.json() as Promise<TokenResponse>;
}

export async function fetchMeRequest(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new ApiError('Not authenticated', res.status);
  }
  return res.json() as Promise<AuthUser>;
}

export async function logoutRequest(accessToken: string): Promise<void> {
  await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => undefined);
}

/** Returns a valid access token, refreshing via JWT refresh token if needed. */
export async function getValidAccessToken(): Promise<string | null> {
  const { access, refresh } = getStoredTokens();
  if (access && !isTokenExpired(access)) return access;
  if (!refresh) return null;
  try {
    const tokens = await refreshTokensRequest(refresh);
    persistSession(tokens);
    return tokens.access_token;
  } catch {
    clearSession();
    return null;
  }
}

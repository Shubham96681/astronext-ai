import { ApiError } from '@/lib/api';
import { clearAuthCookies, setAuthCookies, ACCESS_COOKIE } from '@/lib/authCookies';
import { isTokenExpired } from '@/lib/jwt';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const TOKEN_KEY = 'astronext_token';
export const REFRESH_KEY = 'astronext_refresh_token';
export const USER_KEY = 'astronext_user';

export type UserRole = 'customer' | 'astrologer' | 'admin' | 'ops';

export type AuthUser = {
  id: string | number;
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

// ── New auth (OTP + Google) ───────────────────────────────────────────────

type NewAuthResponse = {
  access_token: string;
  token_type: string;
  user: Record<string, unknown>;
};

export function persistNewSession(res: NewAuthResponse, fallbackName?: string): AuthUser {
  const u = res.user as Record<string, unknown>;
  const user: AuthUser = {
    id: (u.UserId as string) ?? '',
    email: (u.email as string) ?? '',
    name: (u.Name as string) ?? fallbackName ?? '',
    role: 'customer',
  };
  localStorage.setItem(TOKEN_KEY, res.access_token);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Set cookie so middleware and server reads see the token (30-day expiry, no refresh token)
  const thirtyDays = 30 * 24 * 60 * 60;
  setAuthCookies(res.access_token, '', thirtyDays);
  return user;
}

export async function sendOtpRequest(mobile: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError((body as { detail?: string }).detail ?? 'Failed to send OTP', res.status);
  }
}

export async function verifyOtpRequest(mobile: string, otp: string): Promise<NewAuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, otp }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError((body as { detail?: string }).detail ?? 'Invalid OTP', res.status);
  }
  return res.json() as Promise<NewAuthResponse>;
}

export async function googleAuthRequest(idToken: string): Promise<NewAuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError((body as { detail?: string }).detail ?? 'Google login failed', res.status);
  }
  return res.json() as Promise<NewAuthResponse>;
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

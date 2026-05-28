'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  clearSession,
  fetchMeRequest,
  getValidAccessToken,
  googleAuthRequest,
  loginRequest,
  logoutRequest,
  persistNewSession,
  persistSession,
  registerRequest,
  sendOtpRequest,
  verifyOtpRequest,
  USER_KEY,
  type AuthUser,
  type TokenResponse,
} from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { isTokenExpired, tokenExpiresInMs } from '@/lib/jwt';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<TokenResponse>;
  register: (name: string, email: string, password: string) => Promise<TokenResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  sendOtp: (mobile: string) => Promise<void>;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyTokens = useCallback((tokens: TokenResponse) => {
    const me = persistSession(tokens);
    setToken(tokens.access_token);
    setUser(me);
    return me;
  }, []);

  const scheduleRefresh = useCallback((accessToken: string) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    const ms = tokenExpiresInMs(accessToken);
    if (ms <= 0) return;
    const refreshIn = Math.max(ms - 60_000, 10_000);
    refreshTimer.current = setTimeout(async () => {
      const next = await getValidAccessToken();
      if (next) {
        setToken(next);
        scheduleRefresh(next);
      } else {
        setToken(null);
        setUser(null);
      }
    }, refreshIn);
  }, []);

  const refreshSession = useCallback(async () => {
    const access = await getValidAccessToken();
    if (!access) {
      setToken(null);
      setUser(null);
      return null;
    }
    setToken(access);
    try {
      const me = await fetchMeRequest(access);
      setUser(me);
      scheduleRefresh(access);
    } catch {
      clearSession();
      setToken(null);
      setUser(null);
      return null;
    }
    return access;
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    const current = token;
    clearSession();
    setToken(null);
    setUser(null);
    if (current) await logoutRequest(current);
  }, [token]);

  useEffect(() => {
    (async () => {
      const access = await getValidAccessToken();
      if (!access) {
        setIsLoading(false);
        return;
      }
      setToken(access);

      // Use the stored user immediately so the UI is responsive
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try { setUser(JSON.parse(stored) as AuthUser); } catch { /* ignore */ }
      }

      try {
        const me = await fetchMeRequest(access);
        setUser(me);
        scheduleRefresh(access);
      } catch (err) {
        // Only clear session on 401 (invalid/expired token), not network errors
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          setToken(null);
          setUser(null);
        }
        // Otherwise keep the stored user — backend may be temporarily unreachable
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [scheduleRefresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginRequest(email, password);
      applyTokens(res);
      scheduleRefresh(res.access_token);
      return res;
    },
    [applyTokens, scheduleRefresh],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await registerRequest(name, email, password);
      applyTokens(res);
      scheduleRefresh(res.access_token);
      return res;
    },
    [applyTokens, scheduleRefresh],
  );

  const sendOtp = useCallback(async (mobile: string) => {
    await sendOtpRequest(mobile);
  }, []);

  const verifyOtp = useCallback(
    async (mobile: string, otp: string) => {
      const res = await verifyOtpRequest(mobile, otp);
      const me = persistNewSession(res);
      setToken(res.access_token);
      setUser(me);
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    const { signInWithPopup } = await import('firebase/auth');
    const { firebaseAuth, googleProvider } = await import('@/lib/firebase');
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const idToken = await result.user.getIdToken();
    const res = await googleAuthRequest(idToken);
    const me = persistNewSession(res, result.user.displayName ?? undefined);
    setToken(res.access_token);
    setUser(me);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout, refreshSession, sendOtp, verifyOtp, loginWithGoogle }),
    [user, token, isLoading, login, register, logout, refreshSession, sendOtp, verifyOtp, loginWithGoogle],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

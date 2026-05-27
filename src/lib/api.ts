import { getValidAccessToken, type AuthUser, type UserRole } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export type { AuthUser, UserRole };

export type StatCard = {
  label: string;
  value: string;
  change?: string | null;
  trend?: 'up' | 'down' | 'neutral' | null;
};

export type ConsultationRow = {
  id: number;
  customer_name: string;
  customer_email: string;
  scheduled_at: string;
  duration_minutes: number;
  amount_paise: number;
  status: string;
  notes?: string | null;
};

export type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  store_type: string;
  total_paise: number;
  status: string;
  created_at: string;
};

export type PujaBookingRow = {
  id: number;
  devotee_name: string;
  puja_name: string;
  scheduled_date: string;
  amount_paise: number;
  status: string;
  created_at: string;
};

export type AstrologerAdminProfile = {
  id: number;
  legacy_id: number;
  slug: string;
  name: string;
  specialty: string;
  title: string;
  price_per_minute_paise: number;
  online_status: string;
  rating_avg: number;
  consultation_count: number;
};

export type AstrologerListRow = {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  title: string;
  rating: number;
  reviews: number;
  consultations: number;
  exp: number;
  price_per_minute: number;
  online: boolean;
  languages: string;
  avatar: string;
  portrait: string;
  verified: boolean;
};

export type AdminDashboardData = {
  stats: StatCard[];
  recent_consultations: ConsultationRow[];
  recent_puja_bookings: PujaBookingRow[];
  astrologers: AstrologerListRow[];
  products_note?: string;
};

export type AstrologerDashboardData = {
  profile: AstrologerAdminProfile & {
    tagline?: string;
    bio?: string;
    bio_long?: string;
    languages?: string;
    avatar_url?: string;
    portrait_url?: string;
    specialities?: { title: string; description: string }[];
  };
  stats: StatCard[];
  upcoming_consultations: ConsultationRow[];
  recent_consultations: ConsultationRow[];
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, token?: string | null, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = 'Request failed';
    try {
      const body = await res.json();
      detail = body.detail ?? body.title ?? detail;
      if (typeof detail !== 'string') detail = JSON.stringify(detail);
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new ApiError('Not authenticated', 401);
  return apiFetch<T>(path, token, init);
}

export function fetchAdminDashboard() {
  return authFetch<AdminDashboardData>('/api/v1/admin/dashboard');
}

export function fetchAstrologerDashboard() {
  return authFetch<AstrologerDashboardData>('/api/v1/astrologer/dashboard');
}

export function updateAstrologerOnlineStatus(online_status: 'online' | 'busy' | 'offline') {
  return authFetch<AstrologerAdminProfile>('/api/v1/astrologer/online', {
    method: 'PATCH',
    body: JSON.stringify({ online_status }),
  });
}

export function isProfileOnline(profile: { online_status?: string }): boolean {
  return profile.online_status === 'online' || profile.online_status === 'busy';
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export { ApiError };

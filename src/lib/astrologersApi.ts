import type { Astrologer } from '@/content/astrologersData';
import { ASTROLOGERS, resolveAstrologerParam } from '@/content/astrologersData';

// Proxy route — requests go through Next.js server to avoid CORS
const ASTRO_PROXY = '/api/astrologers';

export type ApiAstrologerPublic = {
  id: string;
  slug: string;
  name: string;
  display_name: string;
  title: string;
  tagline: string;
  bio: string;
  primary_expertise: string;
  expertise: string[];
  rating: number;
  total_reviews: number;
  consultation_count: number;
  experience_years: number;
  price_per_minute: number;
  is_live: boolean;
  languages: string[];
  specialities: { name: string; description: string }[];
  profile_image: string;
  cover_image: string | null;
};

type ApiListResponse = {
  total: number;
  page: number;
  size: number;
  pages: number;
  data: ApiAstrologerPublic[];
};

export function mapAstrologerFromApi(row: ApiAstrologerPublic): Astrologer {
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name || row.name,
    specialty: row.primary_expertise || row.expertise?.[0] || '',
    title: row.title,
    tagline: row.tagline,
    bio: row.bio,
    bioLong: row.bio,
    rating: row.rating,
    reviews: row.total_reviews,
    consultations: row.consultation_count,
    exp: row.experience_years,
    pricePerMinute: row.price_per_minute,
    online: row.is_live,
    languages: Array.isArray(row.languages) ? row.languages.join(', ') : row.languages,
    specialities: (row.specialities ?? []).map((s) => ({ title: s.name, description: s.description })),
    avatar: row.profile_image,
    portrait: row.cover_image ?? row.profile_image,
  };
}

export async function fetchAstrologersFromApi(): Promise<Astrologer[]> {
  try {
    const res = await fetch(`${ASTRO_PROXY}?page=1&size=20`);
    if (!res.ok) return ASTROLOGERS;
    const json = (await res.json()) as ApiListResponse;
    if (!json.data?.length) return ASTROLOGERS;
    return json.data.map(mapAstrologerFromApi);
  } catch {
    return ASTROLOGERS;
  }
}

export async function fetchAstrologerByParam(param: string): Promise<Astrologer | undefined> {
  try {
    // /api/astrologers/[id] proxies to localhost:8000 server-side (supports UUID and slug)
    const res = await fetch(`/api/astrologers/${encodeURIComponent(param)}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) return mapAstrologerFromApi((await res.json()) as ApiAstrologerPublic);
  } catch {
    /* static fallback */
  }
  return resolveAstrologerParam(param);
}

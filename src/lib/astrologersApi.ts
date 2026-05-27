import type { Astrologer } from '@/content/astrologersData';
import { ASTROLOGERS, resolveAstrologerParam } from '@/content/astrologersData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export type ApiAstrologerPublic = {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  title: string;
  tagline: string;
  bio: string;
  bio_long: string;
  rating: number;
  reviews: number;
  consultations: number;
  exp: number;
  price_per_minute: number;
  online: boolean;
  languages: string;
  specialities: { title: string; description: string }[];
  avatar: string;
  portrait: string;
};

type ApiListResponse = {
  data: ApiAstrologerPublic[];
  meta: { total: number };
};

export function mapAstrologerFromApi(row: ApiAstrologerPublic): Astrologer {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    specialty: row.specialty,
    title: row.title,
    tagline: row.tagline,
    bio: row.bio,
    bioLong: row.bio_long,
    rating: row.rating,
    reviews: row.reviews,
    consultations: row.consultations,
    exp: row.exp,
    pricePerMinute: row.price_per_minute,
    online: row.online,
    languages: row.languages,
    specialities: row.specialities,
    avatar: row.avatar,
    portrait: row.portrait,
  };
}

export async function fetchAstrologersFromApi(): Promise<Astrologer[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/astrologers`);
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
    const res = await fetch(`${API_BASE}/api/v1/astrologers/${encodeURIComponent(param)}`);
    if (res.ok) return mapAstrologerFromApi((await res.json()) as ApiAstrologerPublic);
  } catch {
    /* static fallback */
  }
  return resolveAstrologerParam(param);
}

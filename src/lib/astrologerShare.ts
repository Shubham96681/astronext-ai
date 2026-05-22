import type { Astrologer } from '@/content/astrologersData';
import { ROUTES } from '@/routes/paths';

export type AstrologerShareMedium = 'member_android' | 'member_ios' | 'member_web' | 'copy_link';

const DEFAULT_UTM = {
  utm_source: 'share_via',
  utm_content: 'profile',
} as const;

export function astrologerProfilePath(slug: string): string {
  return `${ROUTES.astrologers}/${slug}`;
}

export function buildAstrologerShareUrl(
  astrologer: Pick<Astrologer, 'slug'>,
  options?: {
    medium?: AstrologerShareMedium;
    origin?: string;
  },
): string {
  const origin =
    options?.origin ??
    (typeof window !== 'undefined' ? window.location.origin : 'https://astronext.ai');

  const url = new URL(astrologerProfilePath(astrologer.slug), origin);
  url.searchParams.set('utm_source', DEFAULT_UTM.utm_source);
  url.searchParams.set('utm_content', DEFAULT_UTM.utm_content);
  url.searchParams.set('utm_medium', options?.medium ?? detectShareMedium());
  return url.toString();
}

function detectShareMedium(): AstrologerShareMedium {
  if (typeof navigator === 'undefined') return 'member_web';
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'member_android';
  if (/iphone|ipad|ipod/.test(ua)) return 'member_ios';
  return 'member_web';
}

export async function copyAstrologerShareLink(
  astrologer: Pick<Astrologer, 'slug'>,
  medium: AstrologerShareMedium = 'copy_link',
): Promise<boolean> {
  const url = buildAstrologerShareUrl(astrologer, { medium });
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export async function shareAstrologerProfile(astrologer: Astrologer): Promise<'shared' | 'copied' | 'failed'> {
  const url = buildAstrologerShareUrl(astrologer);
  const title = `${astrologer.name} — AstroNext Astrologer`;
  const text = astrologer.tagline;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return 'failed';
    }
  }

  const copied = await copyAstrologerShareLink(astrologer, 'copy_link');
  return copied ? 'copied' : 'failed';
}

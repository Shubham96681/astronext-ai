/** URL paths — used with Next.js App Router */

import { getAstrologerById, resolveAstrologerParam } from '@/content/astrologersData';

export const ROUTES = {
  home: '/',
  kundali: '/kundali',
  astrologers: '/astrologers',
  divineStore: '/divine-store',
  estore: '/estore',
  puja: '/puja',
  login: '/login',
  signup: '/signup',
} as const;

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Legacy tab ids — still used for logo theme & layout flags */
export type AppTab =
  | 'home'
  | 'kundali'
  | 'estore'
  | 'jgstore'
  | 'puja'
  | 'astrologers'
  | 'login'
  | 'signup';

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function divineStoreProductPath(productId: number): string {
  return `${ROUTES.divineStore}/product/${productId}`;
}

/** Canonical shareable profile URL (slug-based) */
export function astrologerDetailPath(astrologerOrId: { slug: string } | number): string {
  if (typeof astrologerOrId === 'number') {
    const astro = getAstrologerById(astrologerOrId);
    return astro ? `${ROUTES.astrologers}/${astro.slug}` : `${ROUTES.astrologers}/${astrologerOrId}`;
  }
  return `${ROUTES.astrologers}/${astrologerOrId.slug}`;
}

export function parseRouteId(param: string | undefined): number | null {
  if (!param) return null;
  const n = Number(param);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export function parseAstrologerParam(param: string | undefined) {
  return resolveAstrologerParam(param);
}

export function isDivineStoreProductPath(pathname: string): boolean {
  return /^\/divine-store\/product\/\d+$/.test(normalizePath(pathname));
}

export function isAstrologerDetailPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return /^\/astrologers\/[^/]+$/.test(path) && path !== ROUTES.astrologers;
}

export function pathnameToTab(pathname: string): AppTab {
  const path = normalizePath(pathname);

  if (path === ROUTES.kundali || path.startsWith(`${ROUTES.kundali}/`)) {
    return 'kundali';
  }
  if (path === ROUTES.astrologers || isAstrologerDetailPath(path)) {
    return 'astrologers';
  }
  if (path === ROUTES.divineStore || isDivineStoreProductPath(path)) {
    return 'jgstore';
  }
  if (path === ROUTES.estore) return 'estore';
  if (path === ROUTES.puja) return 'puja';
  if (path === ROUTES.login) return 'login';
  if (path === ROUTES.signup) return 'signup';
  return 'home';
}

/** Listing pages with transparent/overlay nav over hero */
export function isHeroOverlayPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path === ROUTES.kundali ||
    path === ROUTES.astrologers ||
    path === ROUTES.divineStore
  );
}

/** Detail sub-routes — sticky header + hamburger (not hero overlay) */
export function isDetailSubRoute(pathname: string): boolean {
  return isDivineStoreProductPath(pathname) || isAstrologerDetailPath(pathname);
}

export function tabToPath(tab: AppTab): AppRoutePath {
  switch (tab) {
    case 'kundali':
      return ROUTES.kundali;
    case 'astrologers':
      return ROUTES.astrologers;
    case 'jgstore':
      return ROUTES.divineStore;
    case 'estore':
      return ROUTES.estore;
    case 'puja':
      return ROUTES.puja;
    case 'login':
      return ROUTES.login;
    case 'signup':
      return ROUTES.signup;
    default:
      return ROUTES.home;
  }
}

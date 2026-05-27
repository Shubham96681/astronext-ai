import { pathnameToTab, type AppTab } from '../routes/paths';

/** Logo theme per page — maps to assets in src/assets/logos/ */

export type LogoTheme = 'light' | 'on-dark' | 'purple' | 'gold' | 'footer';

export type { AppTab };

/** Header logo — purple + gold lockup (ASTRO NEXT 1) on light / pink heroes */
export function getNavLogoTheme(tab: AppTab): LogoTheme {
  switch (tab) {
    case 'kundali':
    case 'astrologers':
      return 'purple';
    case 'jgstore':
      return 'gold';
    default:
      return 'light';
  }
}

export function getNavLogoThemeFromPath(pathname: string): LogoTheme {
  return getNavLogoTheme(pathnameToTab(pathname));
}

/** Footer — ASTRO NEXT 4.svg (gold / purple mark on dark navy) */
export function getFooterLogoTheme(): LogoTheme {
  return 'footer';
}

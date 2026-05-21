/** Logo theme per page — maps to assets in src/assets/logos/ */

export type LogoTheme = 'light' | 'on-dark' | 'purple' | 'gold' | 'footer';

export type AppTab =
  | 'home'
  | 'kundali'
  | 'estore'
  | 'jgstore'
  | 'puja'
  | 'astrologers'
  | 'login'
  | 'signup';

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

/** Footer — ASTRO NEXT 4.svg (gold / purple mark on dark navy) */
export function getFooterLogoTheme(): LogoTheme {
  return 'footer';
}

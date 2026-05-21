import logoHeader from '../assets/logos/logo-header.png';
import logoOnDark from '../assets/logos/logo-on-dark.svg';
import logoFooter from '../assets/logos/logo-footer.svg';
import type { LogoTheme } from '../content/logoThemes';

/** Nav: horizontal lockup PNG. Footer: brand SVG from zip. */
const LOGO_SRC: Record<LogoTheme, string> = {
  light: logoHeader,
  'on-dark': logoOnDark,
  purple: logoHeader,
  gold: logoHeader,
  footer: logoFooter,
};

type SiteLogoProps = {
  compact?: boolean;
  variant?: 'default' | 'phone' | 'footer' | 'compact';
  theme?: LogoTheme;
  priority?: boolean;
};

export default function SiteLogo({
  compact = false,
  variant = 'default',
  theme = 'light',
  priority = false,
}: SiteLogoProps) {
  const isFooter = variant === 'footer';
  const resolvedTheme = isFooter ? (theme ?? 'footer') : theme;
  const src = LOGO_SRC[resolvedTheme];
  const isHeader = !isFooter && variant !== 'phone';

  return (
    <div
      className={[
        'site-logo',
        `site-logo--${variant}`,
        `site-logo--theme-${resolvedTheme}`,
        isHeader ? 'site-logo--header' : '',
        compact ? 'site-logo--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={src}
        alt="Astronext.ai — THE NEXT-GEN AI OF ASTROLOGY"
        className="site-logo-img"
        width={isFooter ? 216 : 260}
        height={isFooter ? 108 : 64}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
}

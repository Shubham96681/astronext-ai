import logoFull from '../assets/logo_cropped.png';
import logoFooter from '../assets/astronext-logo.png';

type SiteLogoProps = {
  compact?: boolean;
  /** Slightly larger sizing for the app QR phone mockup */
  variant?: 'default' | 'phone' | 'footer';
  /** Load immediately (phone mockup — avoids visible delay) */
  priority?: boolean;
};

/** Official Astronext.ai logo (icon + wordmark + tagline) */
export default function SiteLogo({ compact = false, variant = 'default', priority = false }: SiteLogoProps) {
  const isFooter = variant === 'footer';
  const src = isFooter ? logoFooter : logoFull;
  const width = isFooter ? 357 : 205;
  const height = isFooter ? 151 : 81;

  return (
    <div
      className={[
        'site-logo',
        `site-logo--${variant}`,
        compact ? 'site-logo--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={src}
        alt="Astronext.ai — THE NEXT-GEN AI OF ASTROLOGY"
        className="site-logo-img"
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
}

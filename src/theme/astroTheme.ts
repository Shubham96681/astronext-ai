/** Shared theme for Emotion styled components & css prop */
export interface AstroTheme {
  colors: {
    primary: string;
    primaryLight: string;
    purple: string;
    gold: string;
    navy: string;
    navyDeep: string;
    accent: string;
    orange: string;
    cream: string;
    white: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    sans: string;
    display: string;
    serif: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  shadows: {
    card: string;
    glow: string;
  };
}

export const astroTheme: AstroTheme = {
  colors: {
    primary: '#251545',
    primaryLight: '#3e266f',
    purple: '#552c83',
    gold: '#d4af37',
    navy: '#110729',
    navyDeep: '#0b0b2a',
    accent: '#25d366',
    orange: '#f15a24',
    cream: '#fdf9f3',
    white: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#666666',
  },
  fonts: {
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    display: "'Playfair Display', Georgia, serif",
    serif: "'Cormorant Garamond', Georgia, serif",
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '9999px',
  },
  shadows: {
    card: '0 8px 32px 0 rgba(119, 78, 171, 0.08)',
    glow: '0 0 20px rgba(59, 28, 122, 0.12)',
  },
};

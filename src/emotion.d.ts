import '@emotion/react';
import type { AstroTheme } from './theme/astroTheme';

declare module '@emotion/react' {
  export interface Theme extends AstroTheme {}
}

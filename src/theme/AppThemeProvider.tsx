import { ThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';
import { astroTheme } from './astroTheme';

type Props = {
  children: ReactNode;
};

export default function AppThemeProvider({ children }: Props) {
  return <ThemeProvider theme={astroTheme}>{children}</ThemeProvider>;
}

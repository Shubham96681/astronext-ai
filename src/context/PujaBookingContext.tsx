'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Puja } from '@/content/pujasData';

type PujaBookingContextValue = {
  selectedPuja: Puja | null;
  openPujaModal: (puja: Puja) => void;
  closePujaModal: () => void;
};

const PujaBookingContext = createContext<PujaBookingContextValue | null>(null);

export function PujaBookingProvider({ children }: { children: ReactNode }) {
  const [selectedPuja, setSelectedPuja] = useState<Puja | null>(null);

  const value = useMemo(
    () => ({
      selectedPuja,
      openPujaModal: (puja: Puja) => setSelectedPuja(puja),
      closePujaModal: () => setSelectedPuja(null),
    }),
    [selectedPuja],
  );

  return <PujaBookingContext.Provider value={value}>{children}</PujaBookingContext.Provider>;
}

export function usePujaBooking() {
  const ctx = useContext(PujaBookingContext);
  if (!ctx) throw new Error('usePujaBooking must be used within PujaBookingProvider');
  return ctx;
}

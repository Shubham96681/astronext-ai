'use client';

import { useEffect, useState } from 'react';
import { type Astrologer } from '@/content/astrologersData';
import { fetchAstrologersFromApi } from '@/lib/astrologersApi';

export function useAstrologers() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAstrologersFromApi()
      .then(setAstrologers)
      .finally(() => setLoading(false));
  }, []);

  return { astrologers, loading };
}

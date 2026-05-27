'use client';

import { useCallback, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import type { Astrologer } from '@/content/astrologersData';
import { shareAstrologerProfile } from '@/lib/astrologerShare';

type AstrologerCardShareButtonProps = {
  astrologer: Astrologer;
  /** `frame` = profile portrait card; `block` = listing grid card */
  variant?: 'frame' | 'block';
  className?: string;
};

export default function AstrologerCardShareButton({
  astrologer,
  variant = 'block',
  className = '',
}: AstrologerCardShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'shared'>('idle');

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const result = await shareAstrologerProfile(astrologer);
      if (result === 'shared') setStatus('shared');
      else if (result === 'copied') setStatus('copied');
      if (result !== 'failed') {
        window.setTimeout(() => setStatus('idle'), 2000);
      }
    },
    [astrologer],
  );

  const label =
    status === 'copied' ? 'Link copied' : status === 'shared' ? 'Shared' : `Share ${astrologer.name}`;

  const baseClass =
    variant === 'frame' ? 'astro-detail-hero__share-btn' : 'astro-block__share-btn';
  const doneClass =
    variant === 'frame' ? 'astro-detail-hero__share-btn--done' : 'astro-block__share-btn--done';

  return (
    <button
      type="button"
      className={`${baseClass} ${status !== 'idle' ? doneClass : ''} ${className}`.trim()}
      onClick={handleShare}
      aria-label={label}
      title={label}
    >
      {status === 'copied' ? <Check size={18} strokeWidth={2.5} aria-hidden /> : <Share2 size={18} aria-hidden />}
    </button>
  );
}

'use client';

import Link from 'next/link';
import { astrologerDetailPath } from '@/routes/paths';
import { formatPerMinutePrice, type Astrologer } from '@/content/astrologersData';
import JgProductImage from '@/components/JgProductImage';
import AstrologerCardShareButton from '@/components/AstrologerCardShareButton';

const BLOCK_THEMES = ['purple', 'orange', 'green', 'blue', 'pink', 'yellow'] as const;

function genreLabel(specialty: string): string {
  const first = specialty.split(/[&,]/)[0]?.trim() ?? specialty;
  return first.length > 22 ? `${first.slice(0, 20)}…` : first;
}

function shortSubtitle(text: string, max = 42): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

type AstrologerBlockCardProps = {
  astro: Astrologer;
  themeIndex: number;
  onChat: () => void;
};

export default function AstrologerBlockCard({ astro, themeIndex, onChat }: AstrologerBlockCardProps) {
  const theme = BLOCK_THEMES[themeIndex % BLOCK_THEMES.length];
  const ratingLabel = astro.rating.toFixed(2);

  return (
    <article className={`astro-block astro-block--${theme} astro-block--col-3`}>
      <AstrologerCardShareButton astrologer={astro} />
      <Link href={astrologerDetailPath(astro)} className="astro-block__surface">
        <span className="astro-block__genre">{genreLabel(astro.specialty)}</span>

        <div className="astro-block__main-inform">
          <div className="astro-block__main-inform-inner">
            <div className="astro-block__hours">{formatPerMinutePrice(astro.pricePerMinute)}</div>
            <div className="astro-block__title">{astro.name}</div>
            <div className="astro-block__subtitle">{shortSubtitle(astro.tagline)}</div>
          </div>
        </div>

        <div className="astro-block__big-hours" aria-label={`Rating ${ratingLabel} out of 5`}>
          {ratingLabel}★
        </div>

        <div className="astro-block__extra-inform">
          <div className="astro-block__extra-inform-inner">
            <div className="astro-block__title">{astro.name}</div>
            <div className="astro-block__subtitle">
              {astro.exp} yrs · {astro.online ? 'Online now' : 'Book session'}
            </div>
          </div>
        </div>

        <div className="astro-block__cover">
          <JgProductImage
            src={astro.portrait}
            alt={astro.name}
            className="astro-block__cover-img"
            loading="lazy"
          />
        </div>
      </Link>

      <button
        type="button"
        className="astro-block__chat-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChat();
        }}
      >
        Get Expert Advice
      </button>
    </article>
  );
}

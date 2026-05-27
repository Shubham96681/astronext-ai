import type { ReactNode } from 'react';
import TextReveal from '@/components/TextReveal';

type PageHeroVariant = 'cosmic' | 'gold' | 'purple' | 'store' | 'puja' | 'kundali';

type PageHeroProps = {
  title: ReactNode;
  subtitle?: string;
  description?: string;
  variant?: PageHeroVariant;
  ticker?: string;
};

export default function PageHero({
  title,
  subtitle,
  description,
  variant = 'purple',
  ticker,
}: PageHeroProps) {
  return (
    <section
      className={`inner-page-hero inner-page-hero--${variant}`}
      aria-labelledby="inner-page-hero-title"
      data-reveal="fade-up"
      data-reveal-immediate
    >
      <div className="inner-page-hero__orb inner-page-hero__orb--a" aria-hidden />
      <div className="inner-page-hero__orb inner-page-hero__orb--b" aria-hidden />
      <div
        className="inner-page-hero__content"
        data-reveal="float-up"
        data-reveal-immediate
        data-reveal-delay="50ms"
      >
        {subtitle ? <p className="inner-page-hero__eyebrow">{subtitle}</p> : null}
        <h1 id="inner-page-hero-title" className="inner-page-hero__title">
          {title}
        </h1>
        {description ? (
          <TextReveal as="p" className="inner-page-hero__desc" immediate>
            {description}
          </TextReveal>
        ) : null}
      </div>
      {ticker ? (
        <div className="inner-page-hero__ticker hero-ticker-bar" data-reveal="fade-up" data-reveal-immediate data-reveal-delay="100ms">
          <p className="hero-ticker-text">{ticker}</p>
        </div>
      ) : null}
    </section>
  );
}

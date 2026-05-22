import { useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import {
  ASTROLOGERS,
  formatConsultCount,
  formatPerMinutePrice,
  formatSessionPrice,
  languageCount,
  languagesList,
  type Astrologer,
} from '../content/astrologersData';
import JgProductImage from './JgProductImage';
import AstrologerCardShareButton from './AstrologerCardShareButton';

type Props = {
  astrologer: Astrologer;
  onBack: () => void;
  onHome?: () => void;
  onSelect: (astro: Astrologer) => void;
  onChat: (astro: Astrologer) => void;
};

function AlsoLikeCard({
  astro,
  onSelect,
}: {
  astro: Astrologer;
  onSelect: () => void;
}) {
  return (
    <article className="astro-detail-also-card">
      <button type="button" className="astro-detail-also-card__btn" onClick={onSelect}>
        <div className="astro-detail-also-card__media">
          <JgProductImage src={astro.portrait} alt={astro.name} loading="lazy" />
        </div>
        <h3 className="astro-detail-also-card__name">{astro.name}</h3>
        <p className="astro-detail-also-card__price">{formatSessionPrice(astro.pricePerMinute)}</p>
      </button>
    </article>
  );
}

export default function AstrologerDetail({ astrologer, onBack, onHome, onSelect, onChat }: Props) {
  const related = ASTROLOGERS.filter((a) => a.id !== astrologer.id).slice(0, 4);
  const bioParagraphs = astrologer.bioLong.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('astro-detail-active');
    return () => document.body.classList.remove('astro-detail-active');
  }, [astrologer.id]);

  return (
    <div className="astro-detail-page">
      <div className="site-shell astro-detail-page__inner">
        <nav className="astro-detail-breadcrumb" aria-label="Breadcrumb" data-reveal="fade-up" data-reveal-immediate>
          <button type="button" className="astro-detail-breadcrumb__link" onClick={onHome ?? onBack}>
            Home
          </button>
          <span className="astro-detail-breadcrumb__sep">/</span>
          <button type="button" className="astro-detail-breadcrumb__link" onClick={onBack}>
            Astrologers
          </button>
          <span className="astro-detail-breadcrumb__sep">/</span>
          <span className="astro-detail-breadcrumb__current">{astrologer.name}</span>
        </nav>

        <section className="astro-detail-hero-wrap" data-reveal="fade-up" data-reveal-immediate data-reveal-delay="40ms">
        <div className="astro-detail-hero">
          <div className="astro-detail-hero__copy" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="80ms">
            <p className="astro-detail-hero__badge">
              + VERIFIED ASTROLOGER · {astrologer.specialty.split('&')[0].trim().toUpperCase()}
            </p>
            <h1 className="astro-detail-hero__name">{astrologer.name}</h1>
            <p className="astro-detail-hero__title">{astrologer.title}</p>
            <p className="astro-detail-hero__tagline">{astrologer.tagline}</p>
            <div className="astro-detail-hero__rating">
              <div className="astro-detail-hero__stars" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i <= Math.round(astrologer.rating) ? '#c9a227' : 'none'}
                    stroke="#c9a227"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <div className="astro-detail-hero__rating-row">
                <span className="astro-detail-hero__score">{astrologer.rating.toFixed(1)}</span>
                <span className="astro-detail-hero__meta">
                  {astrologer.reviews.toLocaleString('en-IN')} reviews ·{' '}
                  {astrologer.consultations.toLocaleString('en-IN')} consultations
                </span>
              </div>
            </div>
          </div>

          <div className="astro-detail-hero__visual" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="140ms">
            <div className="astro-detail-hero__frame">
              <AstrologerCardShareButton astrologer={astrologer} variant="frame" />
              {astrologer.online && (
                <span className="astro-detail-hero__live">
                  <span className="astro-detail-hero__live-dot" aria-hidden />
                  LIVE NOW
                </span>
              )}
              <JgProductImage
                src={astrologer.portrait}
                alt={astrologer.name}
                className="astro-detail-hero__portrait"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        <div className="astro-detail-cta-bar">
          <div className="astro-detail-cta-bar__price-block">
            <p className="astro-detail-cta-bar__price">{formatPerMinutePrice(astrologer.pricePerMinute)}</p>
            <p className="astro-detail-cta-bar__sub">PER MINUTE · PAY-AS-YOU-GO</p>
          </div>
          <div className="astro-detail-cta-bar__lang">
            <span className="astro-detail-cta-bar__lang-label">SPEAKS</span>
            <p className="astro-detail-cta-bar__lang-list">{languagesList(astrologer.languages)}</p>
          </div>
          <button type="button" className="astro-detail-cta-bar__btn" onClick={() => onChat(astrologer)}>
            BOOK CONSULTATION
            <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
          </button>
        </div>
        </section>

        <div className="astro-detail-body" data-reveal="fade-up">
          <section className="astro-detail-about">
            <h2 className="astro-detail-section-title">About</h2>
            <div className="astro-detail-about__text">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <aside className="astro-detail-sidebar">
            <section className="astro-detail-specialities">
              <h2 className="astro-detail-section-title">Specialities</h2>
              <ul className="astro-detail-spec-list">
                {astrologer.specialities.map((spec) => (
                  <li key={spec.title} className="astro-detail-spec-card">
                    <span className="astro-detail-spec-card__icon" aria-hidden>
                      ✦
                    </span>
                    <div>
                      <h3 className="astro-detail-spec-card__title">{spec.title}</h3>
                      <p className="astro-detail-spec-card__desc">{spec.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="astro-detail-stats">
              <div className="astro-detail-stats__item">
                <span className="astro-detail-stats__value">{astrologer.exp}+</span>
                <span className="astro-detail-stats__label">YEARS</span>
              </div>
              <div className="astro-detail-stats__item">
                <span className="astro-detail-stats__value">{formatConsultCount(astrologer.consultations)}</span>
                <span className="astro-detail-stats__label">CONSULTS</span>
              </div>
              <div className="astro-detail-stats__item">
                <span className="astro-detail-stats__value">{languageCount(astrologer.languages)}</span>
                <span className="astro-detail-stats__label">LANGUAGES</span>
              </div>
            </div>
          </aside>
        </div>

        <section className="astro-detail-also" data-reveal="fade-up">
          <h2 className="astro-detail-also__title">You may also like</h2>
          <div className="astro-detail-also__grid" data-reveal="fade-up" data-reveal-stagger>
            {related.map((a) => (
              <AlsoLikeCard key={a.id} astro={a} onSelect={() => onSelect(a)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

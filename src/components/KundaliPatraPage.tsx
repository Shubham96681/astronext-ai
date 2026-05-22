'use client';

import kundaliChart from '../assets/generated/kundali/image3_404_21208.png';
import kundaliCosmicArt from '../assets/generated/kundali/kundali-cosmic-art.png';
import kundaliWaves from '../assets/generated/kundali/image2_404_21208.png';
import {
  KUNDALI_BASIC_DESC,
  KUNDALI_BASIC_FEATURES,
  KUNDALI_BASIC_SUBTITLE,
  KUNDALI_BASIC_TITLE,
  KUNDALI_COSMIC_DESC,
  KUNDALI_COSMIC_SUBTITLE,
  KUNDALI_COSMIC_TITLE,
  KUNDALI_DETAIL_DESC,
  KUNDALI_DETAIL_SUBTITLE,
  KUNDALI_DETAIL_TITLE,
  KUNDALI_HERO_DESC,
  KUNDALI_HERO_SUBTITLE,
  KUNDALI_HERO_TITLE,
  KUNDALI_TICKER_TEXT,
} from '../content/kundaliCopy';
import { usePathname } from 'next/navigation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { imageSrc, ZODIAC_WHEEL_LIGHT_SRC, ZODIAC_WHEEL_SRC } from '@/lib/imageSrc';

export default function KundaliPatraPage() {
  const pathname = usePathname();
  useScrollReveal([pathname]);
  const handleSampleReport = () => {
    document.getElementById('kundali-detail')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="kundali-page">
      <section className="kundali-hero" aria-labelledby="kundali-hero-title" data-reveal="fade-up" data-reveal-immediate>
        <div className="kundali-hero__grid">
          <div className="kundali-hero__copy" data-reveal="fade-up" data-reveal-immediate>
            <h1 id="kundali-hero-title" className="kundali-hero__title">
              {KUNDALI_HERO_TITLE}
            </h1>
            <p className="kundali-hero__tagline">{KUNDALI_HERO_SUBTITLE}</p>
            <p className="kundali-hero__desc">{KUNDALI_HERO_DESC}</p>
          </div>
          <div className="kundali-hero__visual" aria-hidden="true">
            <img
              src={ZODIAC_WHEEL_SRC}
              alt=""
              className="kundali-hero__wheel zodiac-wheel-asset"
              width={1000}
              height={1000}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <div className="kundali-ticker hero-ticker-bar">
        <p className="hero-ticker-text">{KUNDALI_TICKER_TEXT}</p>
      </div>

      <section className="kundali-cosmic" aria-labelledby="kundali-cosmic-title" data-reveal="fade-up">
        <div className="kundali-cosmic__inner">
          <h2 id="kundali-cosmic-title" className="kundali-cosmic__title">
            {KUNDALI_COSMIC_TITLE}
          </h2>
          <p className="kundali-cosmic__subtitle">{KUNDALI_COSMIC_SUBTITLE}</p>
          <p className="kundali-cosmic__desc">{KUNDALI_COSMIC_DESC}</p>
          <figure className="kundali-cosmic__art-wrap">
            <img
              src={imageSrc(kundaliCosmicArt)}
              alt=""
              className="kundali-cosmic__art"
              width={909}
              height={595}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="kundali-basic" aria-labelledby="kundali-basic-title" data-reveal="fade-up">
        <div className="kundali-basic__grid">
          <div className="kundali-basic__wheel-wrap" aria-hidden="true">
            <img
              src={ZODIAC_WHEEL_LIGHT_SRC}
              alt=""
              className="kundali-basic__wheel zodiac-wheel-asset zodiac-wheel-asset--on-dark"
              width={1000}
              height={1000}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="kundali-basic__content">
            <h2 id="kundali-basic-title" className="kundali-basic__title">
              {KUNDALI_BASIC_TITLE}
            </h2>
            <p className="kundali-basic__subtitle">{KUNDALI_BASIC_SUBTITLE}</p>
            <hr className="kundali-basic__rule" />
            <p className="kundali-basic__desc">{KUNDALI_BASIC_DESC}</p>
            <ul className="kundali-basic__features">
              {KUNDALI_BASIC_FEATURES.map((item, i) => (
                <li key={i} className="kundali-basic__feature">
                  <span className="kundali-basic__bullet" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <button type="button" className="kundali-btn kundali-btn--gold" onClick={handleSampleReport}>
              Get Sample Report
            </button>
          </div>
        </div>
      </section>

      <section id="kundali-detail" className="kundali-detail" aria-labelledby="kundali-detail-title" data-reveal="fade-up">
        <img src={imageSrc(kundaliWaves)} alt="" className="kundali-detail__waves" aria-hidden="true" />
        <div className="kundali-detail__inner">
          <h2 id="kundali-detail-title" className="kundali-detail__title">
            {KUNDALI_DETAIL_TITLE}
          </h2>
          <p className="kundali-detail__subtitle">{KUNDALI_DETAIL_SUBTITLE}</p>
          <p className="kundali-detail__desc">{KUNDALI_DETAIL_DESC}</p>
          <button type="button" className="kundali-btn kundali-btn--navy" onClick={handleSampleReport}>
            Get Sample Report
          </button>
          <div className="kundali-detail__chart-wrap">
            <img
              src={imageSrc(kundaliChart)}
              alt="Sample North Indian style Kundli chart"
              className="kundali-detail__chart"
              width={585}
              height={460}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

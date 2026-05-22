'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { HeroStardust } from '@/components/HeroStardust';
import heroWoman from '@/assets/generated/hero-woman.png';
import meditationWoman from '@/assets/generated/meditation-woman.png';
import pujaItems from '@/assets/generated/puja-items.png';
import devotionWaveBg from '@/assets/devotion-wave-bg.svg';
import WhatsAppPhoneMockup from '@/components/WhatsAppPhoneMockup';
import ZodiacWheel from '@/components/ZodiacWheel';
import AppQrMockup from '@/components/AppQrMockup';
import {
  HERO_TICKER_TEXT,
  HOME_HERO_SUBTITLE,
  TESTIMONIALS,
  WHY_ASTRONEXT_FEATURES,
  FAQ_ITEMS,
} from '@/content/siteCopy';
import { estoreProducts } from '@/content/estoreProducts';
import { ROUTES } from '@/routes/paths';
import { useCart } from '@/context/CartContext';
import { imageSrc } from '@/lib/imageSrc';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function HomePage() {
  const router = useRouter();
  const { addedItems, handleAddToCart } = useCart();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useScrollReveal(['/']);

  return (
    <div className="page-section">
      <section className="hero-section">
        <HeroStardust />
        <div className="hero-left" data-reveal="fade-up" data-reveal-immediate>
          <h2 className="hero-title">
            Ask anything,
            <br />
            <span className="hero-title-second">let Pandit Jee answer...</span>
          </h2>
          <p className="hero-subtitle">{HOME_HERO_SUBTITLE}</p>
          <a
            href="https://wa.me/919999999999?text=Namaste%20Pandit%20Jee,%20please%20generate%20my%20Kundli!"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-badge-wrapper"
          >
            <div className="whatsapp-badge">
              <div className="whatsapp-icon-circle">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="whatsapp-badge-text">Get Personal Astro - Chat</span>
            </div>
          </a>
        </div>
        <div className="hero-right" data-reveal="fade-up" data-reveal-immediate data-reveal-delay="120ms">
          <div className="hero-visual-stack">
            <div className="hero-wheel-layer" aria-hidden="true">
              <div className="hero-zodiac-spin">
                <ZodiacWheel className="zodiac-wheel-bg zodiac-wheel-svg" />
              </div>
            </div>
            <div className="hero-woman-layer">
              <div className="hero-woman-cutout">
                <img
                  src={imageSrc(heroWoman)}
                  className="hero-woman-fg hero-woman-fg--generated"
                  alt="Spiritual Indian Woman in Namaste Pose"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-ticker-bar">
        <p className="hero-ticker-text">{HERO_TICKER_TEXT}</p>
      </div>

      <section className="devotion-section" data-reveal="fade-up">
        <h2 className="devotion-title">Ask with devotion</h2>
        <p className="devotion-subtitle">let Pandit Jee offer spiritual light</p>
        <div className="devotion-divider" aria-hidden="true" />
        <p className="devotion-body">
          Got a question? What&apos;s next in life, career, relationship, health. Just ask PanditJee on WhatsApp!
        </p>
        <div className="devotion-phone-stage">
          <div className="devotion-phone-wrap">
            <div className="devotion-phone-backdrop" aria-hidden="true">
              <img className="devotion-wave-mesh" src={imageSrc(devotionWaveBg)} alt="" />
              <div className="devotion-wave-glow" aria-hidden="true" />
            </div>
            <WhatsAppPhoneMockup />
            <a
              href="https://wa.me/919999999999?text=Pranam%20Pandit%20Jee,%20I%20seek%20your%20spiritual%20guidance!"
              target="_blank"
              rel="noopener noreferrer"
              className="devotion-cta"
            >
              <span className="devotion-cta-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="devotion-cta-text">Get Personal Astro - Chat</span>
            </a>
          </div>
        </div>
      </section>

      <section className="cosmic-section" data-reveal="fade">
        <div className="cosmic-section__stars" aria-hidden="true" />
        <div className="cosmic-section__smoke" aria-hidden="true" />
        <div className="cosmic-inner">
          <div className="cosmic-visual" data-reveal="fade-right" data-reveal-delay="80ms">
            <div className="cosmic-visual__backdrop" aria-hidden="true">
              <div className="cosmic-visual__sky" />
              <div className="cosmic-visual__smoke" />
              <div className="cosmic-zodiac-spin">
                <ZodiacWheel className="zodiac-wheel-bg zodiac-wheel-svg zodiac-wheel--cosmic" />
              </div>
            </div>
            <div className="cosmic-figure-layer">
              <img
                src={imageSrc(meditationWoman)}
                alt="Meditation and cosmic alignment"
                className="cosmic-woman section-photo"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="cosmic-content" data-reveal="fade-left" data-reveal-delay="160ms">
            <h2 className="cosmic-headline">Align with the Universe</h2>
            <h3 className="cosmic-subhead">Discover Your Cosmic Connections</h3>
            <div className="cosmic-divider" aria-hidden="true" />
            <p className="cosmic-lead">
              Discover the blueprint of your destiny with Kundli Patra, your personalized astrology report.
            </p>
            <ul className="cosmic-features">
              <li>
                <span className="cosmic-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Detailed and personalized insights
              </li>
              <li>
                <span className="cosmic-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Based on authentic Vedic astrology
              </li>
              <li>
                <span className="cosmic-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Instant digital delivery
              </li>
              <li>
                <span className="cosmic-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Different reports as per your need
              </li>
            </ul>
            <button type="button" className="cosmic-cta-btn" onClick={() => router.push(ROUTES.kundali)}>
              Create Kundli Patra
            </button>
          </div>
        </div>
      </section>

      <section className="puja-promo-section" data-reveal="fade-up">
        <h2 className="puja-promo-title">Embrace Divine Grace</h2>
        <p className="puja-promo-subtitle">Book Your Home Puja Today</p>
        <div className="puja-promo-divider" aria-hidden="true" />
        <p className="puja-promo-body">
          Bring sacred rituals to your doorstep with our customized puja services. Led by experienced priests, each
          ceremony is rooted in ancient traditions and thoughtfully tailored to your spiritual needs.
        </p>
        <button type="button" className="puja-promo-btn" onClick={() => router.push(ROUTES.puja)}>
          Book Your Puja
        </button>
        <div className="puja-promo-visual">
          <img
            src={imageSrc(pujaItems)}
            alt="Traditional puja kalash with offerings"
            className="puja-promo-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="testimonials-section testimonials-section--dark" data-reveal="fade-up">
        <span className="section-eyebrow section-eyebrow--gold section-eyebrow--center">What Our Clients Say</span>
        <h2 className="section-heading section-heading--dark section-heading--center">
          Trusted by thousands seeking clarity
        </h2>
        <div className="testimonial-grid" data-reveal="fade-up" data-reveal-stagger>
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card testimonial-card--dark" key={t.name}>
              <span className="quote-icon">&quot;</span>
              <p className="testimonial-text testimonial-text--light">{t.text}</p>
              <div className="testimonial-author-wrapper">
                <div className="author-initial testimonial-avatar-fallback">{t.initial}</div>
                <span className="testimonial-author-name">{t.name}</span>
              </div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--secondary)" stroke="var(--secondary)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section" data-reveal="fade-up">
        <div className="product-section-header">
          <h2 className="section-heading section-heading--center">Our Divine Products</h2>
          <p className="section-subline section-subline--center">Explore our exclusive range of Divine Products</p>
          <p className="section-body section-body--center" style={{ maxWidth: '750px', margin: '0 auto' }}>
            Discover our curated Divine Products — sacred items and meaningful gifts designed to inspire peace,
            positivity, and spiritual connection. Elevate your space and soul with tradition.
          </p>
        </div>

        <div className="products-slider-grid products-slider-grid--pdf" data-reveal="fade-up" data-reveal-stagger>
          {estoreProducts.map((prod) => (
            <div className="product-card product-card--pdf" key={prod.id}>
              <div className="product-img-wrapper">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="product-photo" loading="lazy" decoding="async" />
                ) : (
                  <div className="product-photo-fallback" style={{ background: prod.iconBg }}>
                    {prod.iconText}
                  </div>
                )}
                <span className="hot-tag">New</span>
                {prod.discount && <span className="discount-tag discount-tag--pdf">{prod.discount}</span>}
              </div>
              <div className="product-info">
                <h3 className="product-name">{prod.name}</h3>
                <div className="product-footer product-footer--pdf">
                  <div className="product-price-wrapper">
                    {prod.originalPrice && <span className="original-price">Rs. {prod.originalPrice}</span>}
                    <span className="product-price">Rs. {prod.price}</span>
                  </div>
                  <button
                    type="button"
                    className="add-cart-text-btn"
                    onClick={() => handleAddToCart(prod.id)}
                    disabled={addedItems[prod.id]}
                  >
                    {addedItems[prod.id] ? 'Added' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-app-section" data-reveal="fade">
        <h2 className="why-app-title" data-reveal="fade-up">
          Why Astronext.ai
        </h2>
        <div className="why-app-inner">
          <div className="why-app-visual">
            <AppQrMockup />
          </div>
          <div className="why-app-content" data-reveal="fade-left" data-reveal-delay="120ms">
            <ul className="why-feature-list">
              {WHY_ASTRONEXT_FEATURES.map((item, i) => (
                <li key={i} className="why-feature-item">
                  <span className="why-feature-text">{item}</span>
                  <span className="why-feature-chevron" aria-hidden="true">
                    &gt;
                  </span>
                </li>
              ))}
            </ul>
            <div className="why-contact-strip">
              <p className="why-contact-label">Contact us for any service</p>
              <div className="why-contact-row">
                <input type="email" className="why-contact-input" placeholder="Your Email" aria-label="Your email" />
                <button
                  type="button"
                  className="why-contact-btn"
                  onClick={() => document.querySelector('.mega-footer')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section faq-section--pdf" data-reveal="fade-up">
        <h2 className="section-heading faq-main-title">Frequently asked questions</h2>
        <div className="faq-list-wrapper">
          {FAQ_ITEMS.map((item, idx) => (
            <div className="faq-item-card" key={idx}>
              <div className="faq-item-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                <span>{item.q}</span>
                <span className={`faq-toggle-icon ${activeFaq === idx ? 'active' : ''}`}>▶</span>
              </div>
              {activeFaq === idx && <div className="faq-item-content">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

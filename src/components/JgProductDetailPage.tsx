'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Award,
  BadgeCheck,
  CreditCard,
  Eye,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  Star,
  Sun,
  Truck,
  X,
} from 'lucide-react';
import { divineStoreProductPath, ROUTES } from '@/routes/paths';
import JgProductImage from './JgProductImage';
import { useCart } from '@/context/CartContext';
import type { JgProduct, PdpBenefitIcon, PdpFaq } from '@/content/jgStoreProducts';

const BENEFIT_ICONS: Record<PdpBenefitIcon, typeof Leaf> = {
  leaf: Leaf,
  sun: Sun,
  shield: Shield,
  eye: Eye,
  sparkles: Star,
  heart: Award,
};

function FaqAccordion({ faqs }: { faqs: PdpFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pdp-faq__list">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="pdp-faq__item">
            <button
              type="button"
              className="pdp-faq__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="pdp-faq__question">{faq.question}</span>
              <span className={`pdp-faq__toggle${isOpen ? ' is-open' : ''}`} aria-hidden>
                {isOpen ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
              </span>
            </button>
            {isOpen && (
              <div className="pdp-faq__panel">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RelatedProductCard({
  product,
  onSelect,
}: {
  product: JgProduct;
  onSelect: () => void;
}) {
  return (
    <article className="astro-detail-also-card">
      <button type="button" className="astro-detail-also-card__btn" onClick={onSelect}>
        <div className="astro-detail-also-card__media">
          <JgProductImage src={product.image} alt={product.name} loading="lazy" />
        </div>
        <h3 className="astro-detail-also-card__name">{product.name}</h3>
        <p className="astro-detail-also-card__price">₹ {product.price.toLocaleString('en-IN')}</p>
      </button>
    </article>
  );
}

function ProductDetailView({
  product,
  onBack,
  onHome,
  onSelectProduct,
  onAddToCart,
  added,
  catalog,
}: {
  product: JgProduct;
  onBack: () => void;
  onHome: () => void;
  onSelectProduct: (id: number) => void;
  onAddToCart: (item: { productId: number; name: string; price: number; image?: string }, qty?: number) => void;
  added: boolean;
  catalog: JgProduct[];
}) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const topAddToCartRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const related = catalog.filter((p) => p.id !== product.id).slice(0, 4);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const displayName = product.displayName ?? product.name;
  const eyebrow = product.eyebrow ?? product.category?.toUpperCase() ?? 'DIVINE STORE';
  const tagline = product.tagline ?? product.desc;
  const authenticity = product.authenticity;
  const perks = product.perks ?? [];
  const perkIcons = [Truck, CreditCard, RotateCcw] as const;
  const whyWear = product.whyWear;
  const wearingMantra = product.wearingMantra ?? {
    eyebrow: 'The wearing mantra',
    omSymbol: 'ॐ',
    mantra: 'ॐ नमः शिवाय',
    transliteration: 'Om Namah Śivāya',
    practice:
      'Salutations to the auspicious one. Recite eleven times each morning while holding your sacred offering over the heart.',
  };
  const mantraOm = wearingMantra.omSymbol ?? 'ॐ';
  const mantraLine = wearingMantra.mantra?.trim();
  const showMantraLine =
    !!mantraLine && mantraLine !== mantraOm && !/^ॐ\s*$/.test(mantraLine);
  const careRitual = product.careRitual;
  const reviewsList = product.reviewsList ?? [];
  const reviewDistribution = product.reviewDistribution ?? [];
  const faqs = product.faqs ?? [];
  const maxReviewCount = Math.max(...reviewDistribution.map((d) => d.count), 1);

  const scrollToReviews = () => {
    document.getElementById('pdp-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const hasCompare =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const savingsPct = hasCompare
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setQty(1);
    setActiveImage(0);
    setStickyVisible(false);
  }, [product.id]);

  useEffect(() => {
    document.body.classList.toggle('pdp-sticky-active', stickyVisible);
    return () => document.body.classList.remove('pdp-sticky-active');
  }, [stickyVisible]);

  useEffect(() => {
    const topAddToCart = topAddToCartRef.current;
    if (!topAddToCart || !product.inStock) {
      setStickyVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky only when the primary top add-to-cart CTA is out of view.
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(topAddToCart);
    return () => observer.disconnect();
  }, [product.id, product.inStock]);

  const handleAddToCart = () =>
    onAddToCart(
      {
        productId: product.id,
        name: displayName,
        price: product.price,
        image: images[0] ?? product.image,
      },
      qty,
    );

  const handleBuyNow = () => {
    handleAddToCart();
  };

  const stickyBar =
    isClient
      ? createPortal(
      <div
        className={`pdp-sticky${stickyVisible ? ' is-visible' : ''}`}
        aria-hidden={!stickyVisible}
      >
        <div className="pdp-sticky__inner">
          <div className="pdp-sticky__thumb" aria-hidden>
            <JgProductImage src={images[0] ?? product.image} alt="" loading="lazy" />
          </div>
          <p className="pdp-sticky__name">{displayName}</p>
          <p className="pdp-sticky__price">Rs. {product.price.toLocaleString('en-IN')}</p>
          <button
            type="button"
            className="pdp-sticky__cta"
            disabled={!product.inStock || added}
            onClick={handleAddToCart}
          >
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>,
      document.body,
      )
      : null;

  return (
    <>
      <section className="pdp-hero-band" aria-label="Product overview">
        <div className="site-shell pdp-hero-band__inner">
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb" data-reveal="fade-up" data-reveal-immediate>
        <button type="button" className="pdp-breadcrumb__link" onClick={onHome}>
          Home
        </button>
        <span className="pdp-breadcrumb__sep">/</span>
        <button type="button" className="pdp-breadcrumb__link" onClick={onBack}>
          Divine Store
        </button>
        <span className="pdp-breadcrumb__sep">/</span>
        <span className="pdp-breadcrumb__current">{product.name}</span>
      </nav>

      <div className="pdp-main" data-reveal="fade-up" data-reveal-immediate>
        <div className="pdp-gallery" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="60ms">
          <div className="pdp-gallery__card">
            {product.galleryBadge && (
              <span className="pdp-gallery__cert">
                <BadgeCheck size={14} strokeWidth={2.25} aria-hidden />
                {product.galleryBadge}
              </span>
            )}
            <JgProductImage
              src={images[activeImage] ?? product.image}
              alt={product.name}
              className="pdp-gallery__img"
              loading="eager"
              fetchPriority="high"
            />
            {images.length > 1 && (
              <div className="pdp-gallery__thumbs" role="list" aria-label="Product images">
                {images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    role="listitem"
                    className={`pdp-gallery__thumb${index === activeImage ? ' is-active' : ''}`}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-current={index === activeImage ? 'true' : undefined}
                    onClick={() => setActiveImage(index)}
                  >
                    <JgProductImage src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pdp-info" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="100ms">
          <div className="pdp-info__main">
          <p className="pdp-eyebrow">{eyebrow}</p>
          <h1 className="pdp-title">{displayName}</h1>
          {tagline && <p className="pdp-tagline">{tagline}</p>}

          <div className="pdp-rating">
            <div className="pdp-rating__stars" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= Math.round(product.rating) ? '#bfa060' : 'none'}
                  stroke="#bfa060"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="pdp-rating__line">
              {product.rating.toFixed(1)} · {product.reviews.toLocaleString('en-IN')} reviews
            </span>
            {product.reviews > 0 && (
              <button type="button" className="pdp-rating__read-all" onClick={scrollToReviews}>
                Read all
              </button>
            )}
          </div>

          <hr className="pdp-divider" />

          <div className="pdp-price-block">
            <div className="pdp-price-row">
              <p className="pdp-price">Rs. {product.price.toLocaleString('en-IN')}</p>
              {hasCompare && (
                <>
                  <p className="pdp-price-compare">
                    Rs. {product.compareAtPrice!.toLocaleString('en-IN')}
                  </p>
                  <span className="pdp-price-save">Save {savingsPct}%</span>
                </>
              )}
            </div>
          </div>

          <div className="pdp-buy">
            {product.inStock && (
              <div className="pdp-buy__row">
                <div className="pdp-qty__stepper" aria-label="Quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    <Minus size={18} strokeWidth={1.75} />
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus size={18} strokeWidth={1.75} />
                  </button>
                </div>
                <button
                  type="button"
                  ref={topAddToCartRef}
                  className="pdp-cta"
                  disabled={added}
                  onClick={handleAddToCart}
                >
                  {added ? 'Added to cart' : 'Add to cart'}
                </button>
              </div>
            )}
            <button
              type="button"
              className="pdp-buy-now"
              disabled={!product.inStock}
              onClick={handleBuyNow}
            >
              Buy it now
            </button>
          </div>
          </div>

          <div className="pdp-info__foot">
            {authenticity && (
              <div className="pdp-authenticity">
                <span className="pdp-authenticity__icon" aria-hidden>
                  <Award size={22} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="pdp-authenticity__title">{authenticity.title}</p>
                  <p className="pdp-authenticity__desc">{authenticity.description}</p>
                </div>
              </div>
            )}

            {perks.length > 0 && (
              <ul className="pdp-perks">
                {perks.map((perk, index) => {
                  const Icon = perkIcons[index % perkIcons.length];
                  return (
                    <li key={perk.title} className="pdp-perks__item">
                      <Icon className="pdp-perks__icon" size={20} strokeWidth={1.5} aria-hidden />
                      <div>
                        <p className="pdp-perks__title">{perk.title}</p>
                        <p className="pdp-perks__subtitle">{perk.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
        </div>
      </section>

      <div className="site-shell astro-detail-page__inner">
      <div className="pdp-sections" data-reveal="fade-up">
        {whyWear && (
          <section className="pdp-sec pdp-sec--why" aria-labelledby="pdp-why-heading">
            <div className="pdp-why-inner">
              <header className="pdp-why-header">
                <p className="pdp-why-eyebrow">{whyWear.eyebrow ?? 'Why wear it'}</p>
                <h2 id="pdp-why-heading" className="pdp-why-title">
                  <span className="pdp-why-title__main">{whyWear.headline}</span>
                  {whyWear.headlineAccent && (
                    <em className="pdp-why-title__accent"> {whyWear.headlineAccent}</em>
                  )}
                </h2>
                <p className="pdp-why-intro">{whyWear.intro}</p>
              </header>
              <ul className="pdp-why-grid">
                {whyWear.benefits.slice(0, 4).map((benefit) => {
                  const Icon = BENEFIT_ICONS[benefit.icon] ?? Leaf;
                  return (
                    <li key={benefit.title} className="pdp-why-card">
                      <span className="pdp-why-card__icon" aria-hidden>
                        <Icon size={22} strokeWidth={1.25} />
                      </span>
                      <h3 className="pdp-why-card__title">{benefit.title}</h3>
                      <p className="pdp-why-card__desc">{benefit.description}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        <section className="pdp-sec pdp-sec--mantra" aria-labelledby="pdp-mantra-heading">
            <div className="pdp-mantra-panel">
              <div className="pdp-mantra-panel__inner">
                <p className="pdp-mantra-eyebrow">
                  {wearingMantra.eyebrow ?? 'The wearing mantra'}
                </p>
                <p className="pdp-mantra-om" aria-hidden>
                  {mantraOm}
                </p>
                {showMantraLine && (
                  <h2 id="pdp-mantra-heading" className="pdp-mantra-sanskrit">
                    {mantraLine}
                  </h2>
                )}
                {!showMantraLine && (
                  <h2 id="pdp-mantra-heading" className="visually-hidden">
                    {wearingMantra.eyebrow ?? 'The wearing mantra'}
                  </h2>
                )}
                {wearingMantra.transliteration && (
                  <p className="pdp-mantra-translit">{wearingMantra.transliteration}</p>
                )}
                <hr className="pdp-mantra-rule" />
                <p className="pdp-mantra-practice">{wearingMantra.practice}</p>
              </div>
            </div>
          </section>

        {careRitual && careRitual.steps.length > 0 && (
          <section className="pdp-sec pdp-sec--care" aria-labelledby="pdp-care-heading">
            <div className="pdp-care-inner">
              <header className="pdp-care-header">
                <p className="pdp-care-eyebrow">{careRitual.eyebrow ?? 'Care & ritual'}</p>
                <h2 id="pdp-care-heading" className="pdp-care-title">
                  {careRitual.headline}
                </h2>
                <p className="pdp-care-intro">{careRitual.intro}</p>
              </header>
              <ol className="pdp-care-steps">
                {careRitual.steps.slice(0, 4).map((step, index) => (
                  <li key={`${step.title}-${index}`} className="pdp-care-step">
                    <span className="pdp-care-step__num">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="pdp-care-step__title">{step.title}</h3>
                    <p className="pdp-care-step__desc">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <section id="pdp-reviews" className="pdp-sec pdp-sec--reviews" aria-labelledby="pdp-reviews-heading">
          <header className="pdp-reviews-header">
            <p className="pdp-reviews-eyebrow">Reviews</p>
            <h2 id="pdp-reviews-heading" className="pdp-reviews-title">
              What devotees are saying.
            </h2>
          </header>

          <div className="pdp-reviews-summary">
            <div className="pdp-reviews-score">
              <p className="pdp-reviews-score__value">{product.rating.toFixed(1)}</p>
              <div className="pdp-reviews-score__stars pdp-stars" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i <= Math.round(product.rating) ? undefined : 'pdp-star--off'}
                    fill={i <= Math.round(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="pdp-reviews-score__meta">
                Based on {product.reviews.toLocaleString('en-IN')} verified reviews
              </p>
            </div>
            {reviewDistribution.length > 0 && (
              <ul className="pdp-reviews-bars">
                {reviewDistribution.map((row) => (
                  <li key={row.stars} className="pdp-reviews-bar">
                    <span className="pdp-reviews-bar__label">
                      {row.stars}{' '}
                      <Star size={12} fill="currentColor" stroke="currentColor" aria-hidden />
                    </span>
                    <span className="pdp-reviews-bar__track">
                      <span
                        className="pdp-reviews-bar__fill"
                        style={{ width: `${(row.count / maxReviewCount) * 100}%` }}
                      />
                    </span>
                    <span className="pdp-reviews-bar__count">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {reviewsList.length > 0 ? (
            <ul className="pdp-reviews-cards">
              {reviewsList.map((review, index) => (
                <li key={`${review.title}-${index}`} className="pdp-review-card">
                  <div className="pdp-review-card__stars pdp-stars" aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i <= review.rating ? undefined : 'pdp-star--off'}
                        fill={i <= review.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <h3 className="pdp-review-card__title">{review.title}</h3>
                  <p className="pdp-review-card__text">{review.text}</p>
                  {review.author && <p className="pdp-review-card__author">{review.author}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pdp-sec__empty">
              Devotee reviews will appear here. Be the first to share your experience.
            </p>
          )}
        </section>

        {faqs.length > 0 && (
          <section className="pdp-sec pdp-sec--faq" aria-labelledby="pdp-faq-heading">
            <header className="pdp-sec__header pdp-sec__header--center">
              <p className="pdp-sec__eyebrow">Common questions</p>
              <h2 id="pdp-faq-heading" className="pdp-sec__title">
                Asked &amp; answered.
              </h2>
            </header>
            <FaqAccordion faqs={faqs} />
          </section>
        )}
      </div>

      <section className="pdp-also" data-reveal="fade-up">
        <h2 className="pdp-also__title">You may also like</h2>
        {related.length > 0 ? (
          <div className="pdp-also__grid" data-reveal-stagger>
            {related.map((p) => (
              <RelatedProductCard key={p.id} product={p} onSelect={() => onSelectProduct(p.id)} />
            ))}
          </div>
        ) : (
          <p className="pdp-also__empty">More sacred pieces from the Divine Store are on their way.</p>
        )}
      </section>
      </div>

      {stickyBar}
    </>
  );
}

type Props = {
  product: JgProduct | null;
  catalog: JgProduct[];
};

/** Divine Store product detail — Astronext reference layout */
export default function JgProductDetailPage({ product, catalog }: Props) {
  const router = useRouter();
  const { handleAddToCart, addedItems } = useCart();

  useEffect(() => {
    document.body.classList.add('jg-pdp-active');
    return () => {
      document.body.classList.remove('jg-pdp-active', 'pdp-sticky-active');
    };
  }, []);

  useEffect(() => {
    if (!product) {
      router.replace(ROUTES.divineStore);
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  return (
    <div className="astro-detail-page jg-product-detail">
      <ProductDetailView
        product={product}
        catalog={catalog}
        onBack={() => router.push(ROUTES.divineStore)}
        onHome={() => router.push(ROUTES.home)}
        onSelectProduct={(id) => router.push(divineStoreProductPath(id))}
        onAddToCart={handleAddToCart}
        added={!!addedItems[product.id]}
      />
    </div>
  );
}

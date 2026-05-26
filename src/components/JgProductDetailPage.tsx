'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Minus, Plus, Star } from 'lucide-react';
import { divineStoreProductPath, ROUTES } from '@/routes/paths';
import JgProductImage from './JgProductImage';
import { useCart } from '@/context/CartContext';
import { type JgProduct } from '@/content/jgStoreProducts';

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
  onAddToCart: (id: number) => void;
  added: boolean;
  catalog: JgProduct[];
}) {
  const [qty, setQty] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const related = catalog.filter((p) => p.id !== product.id).slice(0, 4);
  const aboutParagraphs = product.descLong.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setReadMore(false);
    setQty(1);
  }, [product.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i += 1) onAddToCart(product.id);
  };

  return (
    <>
      <nav className="astro-detail-breadcrumb" aria-label="Breadcrumb" data-reveal="fade-up" data-reveal-immediate>
        <button type="button" className="astro-detail-breadcrumb__link" onClick={onHome}>
          Home
        </button>
        <span className="astro-detail-breadcrumb__sep">/</span>
        <button type="button" className="astro-detail-breadcrumb__link" onClick={onBack}>
          Divine Store
        </button>
        <span className="astro-detail-breadcrumb__sep">/</span>
        <span className="astro-detail-breadcrumb__current">{product.name}</span>
      </nav>

      <section className="astro-detail-hero-wrap" data-reveal="fade-up" data-reveal-immediate data-reveal-delay="40ms">
        <div className="astro-detail-hero">
          <div className="astro-detail-hero__copy" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="80ms">
            <p className="astro-detail-hero__badge">
              {product.inStock ? '● IN STOCK' : 'OUT OF STOCK'} · {product.category.toUpperCase()}
            </p>
            <h1 className="astro-detail-hero__name">{product.name}</h1>
            <p className="astro-detail-hero__title">{product.category}</p>
            <p className="astro-detail-hero__tagline">{product.desc}</p>
            <div className="astro-detail-hero__rating">
              <div className="astro-detail-hero__stars" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i <= Math.round(product.rating) ? '#c9a227' : 'none'}
                    stroke="#c9a227"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <div className="astro-detail-hero__rating-row">
                <span className="astro-detail-hero__score">{product.rating.toFixed(1)}</span>
                <span className="astro-detail-hero__meta">
                  {product.reviews.toLocaleString('en-IN')} reviews · Divine Store
                </span>
              </div>
            </div>
          </div>

          <div className="astro-detail-hero__visual" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="140ms">
            <div className="astro-detail-hero__frame">
              <span
                className={`astro-detail-hero__live ${product.inStock ? 'astro-detail-hero__live--stock' : 'astro-detail-hero__live--out'}`}
              >
                {product.inStock && <span className="astro-detail-hero__live-dot" aria-hidden />}
                {product.inStock ? 'IN STOCK' : 'UNAVAILABLE'}
              </span>
              <JgProductImage
                src={product.image}
                alt={product.name}
                className="astro-detail-hero__portrait"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        <div className="astro-detail-cta-bar">
          <div className="astro-detail-cta-bar__price-block">
            <p className="astro-detail-cta-bar__price">₹ {product.price.toLocaleString('en-IN')}</p>
            <p className="astro-detail-cta-bar__sub">INCLUSIVE OF BLESSINGS · SHIPS FROM PURI</p>
          </div>
          <div className="astro-detail-cta-bar__lang">
            <span className="astro-detail-cta-bar__lang-label">RATING</span>
            <p className="astro-detail-cta-bar__lang-list">
              {product.rating.toFixed(1)} ★ · {product.reviews.toLocaleString('en-IN')} reviews
            </p>
          </div>
          <div className="jg-product-detail__cta-actions">
            {product.inStock && (
              <div className="jg-product-detail__qty">
                <span className="jg-product-detail__qty-label">QUANTITY</span>
                <div className="jg-product-detail__stepper">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              className="astro-detail-cta-bar__btn"
              disabled={!product.inStock || added}
              onClick={handleAddToCart}
            >
              {added ? 'ADDED TO CART' : product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <div className="astro-detail-body" data-reveal="fade-up">
        <section className="astro-detail-about">
          <h2 className="astro-detail-section-title">About</h2>
          <div className="astro-detail-about__text">
            {(readMore ? aboutParagraphs : aboutParagraphs.slice(0, 1)).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {aboutParagraphs.length > 1 && (
            <button type="button" className="jg-product-detail__read-more" onClick={() => setReadMore((v) => !v)}>
              {readMore ? 'Show less' : 'Read more'}
            </button>
          )}
        </section>

        <aside className="astro-detail-sidebar">
          <section className="astro-detail-specialities">
            <h2 className="astro-detail-section-title">Product Details</h2>
            <ul className="astro-detail-spec-list">
              <li className="astro-detail-spec-card">
                <span className="astro-detail-spec-card__icon" aria-hidden>
                  ✦
                </span>
                <div>
                  <h3 className="astro-detail-spec-card__title">Category</h3>
                  <p className="astro-detail-spec-card__desc">{product.category}</p>
                </div>
              </li>
              <li className="astro-detail-spec-card">
                <span className="astro-detail-spec-card__icon" aria-hidden>
                  ✦
                </span>
                <div>
                  <h3 className="astro-detail-spec-card__title">Availability</h3>
                  <p className="astro-detail-spec-card__desc">
                    {product.inStock ? 'Ready to ship from sacred Puri Dham.' : 'Currently unavailable — check back soon.'}
                  </p>
                </div>
              </li>
              <li className="astro-detail-spec-card">
                <span className="astro-detail-spec-card__icon" aria-hidden>
                  ✦
                </span>
                <div>
                  <h3 className="astro-detail-spec-card__title">Devotee Rating</h3>
                  <p className="astro-detail-spec-card__desc">
                    {product.reviews > 0
                      ? `${product.rating.toFixed(1)} out of 5 based on ${product.reviews.toLocaleString('en-IN')} verified reviews.`
                      : `${product.rating.toFixed(1)} out of 5 — trusted devotional offering.`}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <div className="astro-detail-stats">
            <div className="astro-detail-stats__item">
              <span className="astro-detail-stats__value">
                {product.price >= 1000
                  ? `₹${(product.price / 1000).toFixed(product.price % 1000 === 0 ? 0 : 1)}k`
                  : `₹${product.price}`}
              </span>
              <span className="astro-detail-stats__label">PRICE</span>
            </div>
            <div className="astro-detail-stats__item">
              <span className="astro-detail-stats__value">{product.rating.toFixed(1)}</span>
              <span className="astro-detail-stats__label">RATING</span>
            </div>
            <div className="astro-detail-stats__item">
              <span className="astro-detail-stats__value">{product.reviews}</span>
              <span className="astro-detail-stats__label">REVIEWS</span>
            </div>
          </div>
        </aside>
      </div>

      <section className="astro-detail-also" data-reveal="fade-up">
        <h2 className="astro-detail-also__title">You may also like</h2>
        <div className="astro-detail-also__grid" data-reveal="fade-up" data-reveal-stagger>
          {related.map((p) => (
            <RelatedProductCard key={p.id} product={p} onSelect={() => onSelectProduct(p.id)} />
          ))}
        </div>
      </section>
    </>
  );
}

type Props = {
  product: JgProduct | null;
  catalog: JgProduct[];
};

/** Divine Store product detail — separate route bundle from listing page */
export default function JgProductDetailPage({ product, catalog }: Props) {
  const router = useRouter();
  const { handleAddToCart, addedItems } = useCart();

  useEffect(() => {
    document.body.classList.add('astro-detail-active');
    return () => document.body.classList.remove('astro-detail-active');
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
      <div className="site-shell astro-detail-page__inner">
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
    </div>
  );
}

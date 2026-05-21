import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react';
import JgProductImage from './JgProductImage';
import heroJagannathTriad from '../assets/generated/hero-jagannath-triad.png';
import {
  JG_STORE_HERO_SUBTITLE,
  JG_STORE_HERO_TITLE,
  JG_STORE_SECTION_DESC,
  JG_STORE_SECTION_TITLE,
  JG_STORE_TICKER_TEXT,
} from '../content/siteCopy';
import { JG_STORE_PRODUCTS, type JgProduct } from '../content/jgStoreProducts';
import { useScrollReveal } from '../hooks/useScrollReveal';

type AvailabilityFilter = 'all' | 'in' | 'out';
type PriceFilter = 'all' | 'under1000' | '1000-4000' | 'over4000';
type SortOption = 'best' | 'price-asc' | 'price-desc' | 'rating';

function filterAndSortProducts(
  products: JgProduct[],
  availability: AvailabilityFilter,
  price: PriceFilter,
  sort: SortOption,
): JgProduct[] {
  let list = [...products];

  if (availability === 'in') list = list.filter((p) => p.inStock);
  if (availability === 'out') list = list.filter((p) => !p.inStock);

  if (price === 'under1000') list = list.filter((p) => p.price < 1000);
  if (price === '1000-4000') list = list.filter((p) => p.price >= 1000 && p.price <= 4000);
  if (price === 'over4000') list = list.filter((p) => p.price > 4000);

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      list.sort((a, b) => b.reviews - a.reviews);
  }

  return list;
}

type Props = {
  onAddToCart: (id: number) => void;
  addedItems: Record<number, boolean>;
};

function ProductCard({
  product,
  onSelect,
  onAddToCart,
  added,
}: {
  product: JgProduct;
  onSelect: () => void;
  onAddToCart: () => void;
  added: boolean;
}) {
  return (
    <article className="jg-product-card">
      <div className="jg-product-card__top">
        <button type="button" className="jg-product-card__media" onClick={onSelect} aria-label={`View ${product.name}`}>
          <div className="jg-product-card__img-wrap">
            <JgProductImage src={product.image} alt={product.name} className="jg-product-card__img" loading="lazy" />
          </div>
        </button>
        <span className={`jg-stock-pill ${product.inStock ? 'jg-stock-pill--in' : 'jg-stock-pill--out'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <div className="jg-product-card__body">
        <p className="jg-product-card__category">{product.category}</p>
        <h3 className="jg-product-card__name">
          <button type="button" className="jg-product-card__name-btn" onClick={onSelect}>
            {product.name}
          </button>
        </h3>
        <div className="jg-product-card__rating">
          <Star size={14} fill="currentColor" stroke="none" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="jg-product-card__reviews">({product.reviews})</span>
        </div>
        <p className="jg-product-card__price">₹ {product.price.toLocaleString('en-IN')}</p>
        <button
          type="button"
          className="jg-product-card__cart"
          onClick={onAddToCart}
          disabled={!product.inStock || added}
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function ProductDetail({
  product,
  onBack,
  onSelectProduct,
  onAddToCart,
  added,
  addedItems,
}: {
  product: JgProduct;
  onBack: () => void;
  onSelectProduct: (id: number) => void;
  onAddToCart: (id: number) => void;
  added: boolean;
  addedItems: Record<number, boolean>;
}) {
  const [qty, setQty] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const related = JG_STORE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setReadMore(false);
  }, [product.id]);

  return (
    <div className="detail-ref-page jg-detail-readmore">
      <div className="detail-ref-page__inner site-shell jg-detail-readmore__inner" data-reveal="fade-up" data-reveal-immediate>
        <button type="button" className="detail-ref-page__back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Store
        </button>

        <div className="detail-ref-page__profile">
          <div className="detail-ref-page__media jg-detail-readmore__media">
            <JgProductImage
              src={product.image}
              alt={product.name}
              className="jg-detail-readmore__img"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          <div className="detail-ref-page__info">
            <span className={`detail-ref-page__stock ${product.inStock ? '' : ' detail-ref-page__stock--out'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <p className="detail-ref-page__category">{product.category}</p>
            <h1 className="detail-ref-page__title">{product.name}</h1>

            <hr className="detail-ref-page__dash" />

            <div className="detail-ref-page__rating">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} fill={i <= Math.round(product.rating) ? '#d4af37' : 'none'} stroke="#d4af37" />
              ))}
              <span>
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>

            <hr className="detail-ref-page__dash" />

            <p className="detail-ref-page__price">₹ {product.price.toLocaleString('en-IN')}</p>
            <p className="detail-ref-page__desc">{product.desc}</p>
            {readMore && <p className="detail-ref-page__desc detail-ref-page__desc--long">{product.descLong}</p>}

            <div className="detail-ref-page__actions">
              <button
                type="button"
                className="detail-ref-page__cta detail-ref-page__cta--outline"
                onClick={() => setReadMore((v) => !v)}
              >
                {readMore ? 'Show Less' : 'Read More'}
              </button>

              {product.inStock && (
                <div className="jg-detail-readmore__qty">
                  <span className="detail-ref-page__qty-label">Quantity</span>
                  <div className="jg-detail-readmore__stepper">
                    <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                      <Minus size={16} />
                    </button>
                    <span>{qty}</span>
                    <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="detail-ref-page__cta"
                disabled={!product.inStock || added}
                onClick={() => onAddToCart(product.id)}
              >
                {added ? 'Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        <section className="jg-detail-readmore__related">
          <h2 className="detail-ref-page__related-title">Related Products</h2>
          <div className="jg-store-grid">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={() => onSelectProduct(p.id)}
                onAddToCart={() => onAddToCart(p.id)}
                added={!!addedItems[p.id]}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function JagannathStoreHero() {
  return (
    <section className="jg-store-hero" aria-labelledby="jg-store-hero-title" data-reveal="fade-up" data-reveal-immediate>
      <div className="jg-store-hero__left" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="60ms">
        <h1 id="jg-store-hero-title" className="jg-store-hero__title">
          {JG_STORE_HERO_TITLE}
        </h1>
        <p className="jg-store-hero__subtitle">{JG_STORE_HERO_SUBTITLE}</p>
      </div>
      <div className="jg-store-hero__right" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="120ms">
        <div className="jg-store-hero__visual">
          <img
            src={heroJagannathTriad}
            className="jg-store-hero__deities"
            alt="Balabhadra, Subhadra, and Jagannath"
          />
        </div>
      </div>
    </section>
  );
}

function StoreListingControls({
  availabilityFilter,
  priceFilter,
  sortBy,
  hasActiveFilters,
  onAvailabilityChange,
  onPriceChange,
  onSortChange,
  onClearFilters,
}: {
  availabilityFilter: AvailabilityFilter;
  priceFilter: PriceFilter;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  onAvailabilityChange: (v: AvailabilityFilter) => void;
  onPriceChange: (v: PriceFilter) => void;
  onSortChange: (v: SortOption) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="jg-store-controls">
      <div className="jg-store-controls__row">
        <div className="jg-store-controls__filters">
          <span className="jg-store-controls__label">Filter:</span>
          <label className="jg-store-select-wrap">
            <span className="sr-only">Availability</span>
            <select
              className="jg-store-select"
              value={availabilityFilter}
              onChange={(e) => onAvailabilityChange(e.target.value as AvailabilityFilter)}
              aria-label="Filter by availability"
            >
              <option value="all">Availability</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <ChevronDown size={14} className="jg-store-select__icon" aria-hidden />
          </label>
          <label className="jg-store-select-wrap">
            <span className="sr-only">Price</span>
            <select
              className="jg-store-select"
              value={priceFilter}
              onChange={(e) => onPriceChange(e.target.value as PriceFilter)}
              aria-label="Filter by price"
            >
              <option value="all">Price</option>
              <option value="under1000">Under ₹ 1,000</option>
              <option value="1000-4000">₹ 1,000 – ₹ 4,000</option>
              <option value="over4000">Above ₹ 4,000</option>
            </select>
            <ChevronDown size={14} className="jg-store-select__icon" aria-hidden />
          </label>
        </div>

        <div className="jg-store-controls__sort">
          <span className="jg-store-controls__label">Sort By:</span>
          <label className="jg-store-select-wrap">
            <span className="sr-only">Sort products</span>
            <select
              className="jg-store-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort products"
            >
              <option value="best">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={14} className="jg-store-select__icon" aria-hidden />
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="jg-store-controls__tags">
          {availabilityFilter === 'in' && (
            <span className="jg-filter-tag">
              Availability: In Stock
              <button type="button" aria-label="Remove availability filter" onClick={() => onAvailabilityChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {availabilityFilter === 'out' && (
            <span className="jg-filter-tag">
              Availability: Out of Stock
              <button type="button" aria-label="Remove availability filter" onClick={() => onAvailabilityChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {priceFilter === 'under1000' && (
            <span className="jg-filter-tag">
              Price: Under ₹ 1,000
              <button type="button" aria-label="Remove price filter" onClick={() => onPriceChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {priceFilter === '1000-4000' && (
            <span className="jg-filter-tag">
              Price: ₹ 1,000 – ₹ 4,000
              <button type="button" aria-label="Remove price filter" onClick={() => onPriceChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {priceFilter === 'over4000' && (
            <span className="jg-filter-tag">
              Price: Above ₹ 4,000
              <button type="button" aria-label="Remove price filter" onClick={() => onPriceChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          <button type="button" className="jg-clear-filters" onClick={onClearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function JagannathStorePage({ onAddToCart, addedItems }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const selected = selectedId ? JG_STORE_PRODUCTS.find((p) => p.id === selectedId) : null;

  const filteredProducts = useMemo(
    () => filterAndSortProducts(JG_STORE_PRODUCTS, availabilityFilter, priceFilter, sortBy),
    [availabilityFilter, priceFilter, sortBy],
  );

  const hasActiveFilters = availabilityFilter !== 'all' || priceFilter !== 'all';

  useScrollReveal([selectedId]);

  useEffect(() => {
    if (selected) {
      document.body.classList.add('jg-store-detail-active');
    } else {
      document.body.classList.remove('jg-store-detail-active');
    }
    return () => document.body.classList.remove('jg-store-detail-active');
  }, [selected]);

  const clearFilters = () => {
    setAvailabilityFilter('all');
    setPriceFilter('all');
  };

  if (selected) {
    return (
      <div className="jg-store-page jg-store-page--detail">
        <div className="jg-store-detail-shell site-shell">
          <section className="jg-store-listing jg-store-listing--detail">
            <div className="jg-store-inner jg-store-inner--detail">
              <ProductDetail
              product={selected}
              onBack={() => setSelectedId(null)}
              onSelectProduct={setSelectedId}
              onAddToCart={onAddToCart}
              added={!!addedItems[selected.id]}
              addedItems={addedItems}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="jg-store-page">
      <JagannathStoreHero />

      <div className="jg-store-ticker hero-ticker-bar">
        <p className="hero-ticker-text">{JG_STORE_TICKER_TEXT}</p>
      </div>

      <section className="jg-store-listing" aria-labelledby="jg-store-section-title">
        <header className="jg-store-section-header" data-reveal="fade-up">
          <h2 id="jg-store-section-title" className="jg-store-section-title">
            {JG_STORE_SECTION_TITLE}
          </h2>
          <p className="jg-store-section-desc">{JG_STORE_SECTION_DESC}</p>
        </header>

        <div className="jg-store-inner">
          <StoreListingControls
            availabilityFilter={availabilityFilter}
            priceFilter={priceFilter}
            sortBy={sortBy}
            hasActiveFilters={hasActiveFilters}
            onAvailabilityChange={setAvailabilityFilter}
            onPriceChange={setPriceFilter}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />

          <div className="jg-store-grid" role="list" data-reveal="fade-up" data-reveal-stagger>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => setSelectedId(product.id)}
                onAddToCart={() => onAddToCart(product.id)}
                added={!!addedItems[product.id]}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

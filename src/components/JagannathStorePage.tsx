'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { divineStoreProductPath } from '@/routes/paths';
import { ChevronDown, X } from 'lucide-react';
import ShopProductCard from './ShopProductCard';
import TextReveal from '@/components/TextReveal';
import { HeroStardust } from './HeroStardust';
import heroJagannathTriad from '@/assets/generated/hero-jagannath-triad.png';
import { useCart } from '@/context/CartContext';
import { imageSrc } from '@/lib/imageSrc';
import {
  JG_STORE_HERO_SUBTITLE,
  JG_STORE_HERO_TITLE,
  JG_STORE_SECTION_DESC,
  JG_STORE_SECTION_TITLE,
  JG_STORE_TICKER_TEXT,
} from '../content/siteCopy';
import type { JgProduct } from '../content/jgStoreProducts';
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

function JagannathStoreHero() {
  return (
    <section className="jg-store-hero" aria-labelledby="jg-store-hero-title" data-reveal="fade-up" data-reveal-immediate>
      <HeroStardust />
      <div className="jg-store-hero__left" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="60ms">
        <h1 id="jg-store-hero-title" className="jg-store-hero__title">
          {JG_STORE_HERO_TITLE}
        </h1>
        <p className="jg-store-hero__subtitle">{JG_STORE_HERO_SUBTITLE}</p>
      </div>
      <div className="jg-store-hero__right" data-reveal="fade-left" data-reveal-immediate data-reveal-delay="120ms">
        <div className="jg-store-hero__visual">
          <img
            src={imageSrc(heroJagannathTriad)}
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
    <div className="jg-store-controls" data-reveal="fade-up" data-reveal-delay="80ms">
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

type Props = {
  products?: JgProduct[];
};

export default function JagannathStorePage({ products = [] }: Props) {
  const router = useRouter();
  const { handleAddToCart: onAddToCart, addedItems } = useCart();
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('best');

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, availabilityFilter, priceFilter, sortBy),
    [products, availabilityFilter, priceFilter, sortBy],
  );

  const hasActiveFilters = availabilityFilter !== 'all' || priceFilter !== 'all';

  const goToProduct = (id: number) => router.push(divineStoreProductPath(id));

  const clearFilters = () => {
    setAvailabilityFilter('all');
    setPriceFilter('all');
  };

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
          <TextReveal as="p" className="jg-store-section-desc">
            {JG_STORE_SECTION_DESC}
          </TextReveal>
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

          <h3 className="title-shop">Shop</h3>
          {products.length === 0 ? (
            <p className="jg-store-section-desc">Loading products from the store…</p>
          ) : null}
          {filteredProducts.length === 0 && products.length > 0 ? (
            <p className="jg-store-section-desc">No products match your filters.</p>
          ) : null}
          <div className="shop-cards-grid jg-store-grid" role="list" data-reveal="fade-up" data-reveal-stagger>
            {filteredProducts.map((product, index) => (
              <ShopProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
                themeIndex={index}
                inStock={product.inStock}
                added={!!addedItems[product.id]}
                onSelect={() => goToProduct(product.id)}
                onAddToCart={() => onAddToCart(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

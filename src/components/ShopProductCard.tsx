'use client';

import { useState } from 'react';
import { Check, Heart, ShoppingCart } from 'lucide-react';

export type ShopProductCardProps = {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  iconText?: string;
  iconBg?: string;
  themeIndex?: number;
  inStock?: boolean;
  added?: boolean;
  onAddToCart: () => void;
  onSelect?: () => void;
};

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export default function ShopProductCard({
  name,
  category,
  price,
  originalPrice,
  image,
  iconText,
  iconBg,
  themeIndex = 0,
  inStock = true,
  added = false,
  onAddToCart,
  onSelect,
}: ShopProductCardProps) {
  const [saved, setSaved] = useState(false);
  const theme = (themeIndex % 4) + 1;
  const categoryLabel = category.length > 18 ? `${category.slice(0, 16)}…` : category;

  return (
    <article className={`shop-card shop-card--theme-${theme}`}>
      {onSelect ? (
        <button type="button" className="shop-card__img-btn" onClick={onSelect} aria-label={`View ${name}`}>
          <div className="shop-card__img">
            {image ? (
              <img src={image} alt={name} loading="lazy" decoding="async" />
            ) : (
              <div className="shop-card__fallback" style={{ background: iconBg }}>
                <span aria-hidden>{iconText}</span>
              </div>
            )}
          </div>
        </button>
      ) : (
        <div className="shop-card__img">
          {image ? (
            <img src={image} alt={name} loading="lazy" decoding="async" />
          ) : (
            <div className="shop-card__fallback" style={{ background: iconBg }}>
              <span aria-hidden>{iconText}</span>
            </div>
          )}
        </div>
      )}

      <div className="shop-card__name" aria-hidden>
        <p>{categoryLabel}</p>
      </div>

      <div className="shop-card__precis">
        <button
          type="button"
          className={`shop-card__icon shop-card__icon--wish${saved ? ' is-active' : ''}`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
          aria-pressed={saved}
          onClick={() => setSaved((v) => !v)}
        >
          <Heart size={22} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <div className="shop-card__prices">
          {originalPrice != null && originalPrice > price ? (
            <span className="shop-card__preci shop-card__preci--before">{formatRs(originalPrice)}</span>
          ) : null}
          <span className="shop-card__preci shop-card__preci--now">{formatRs(price)}</span>
          {!inStock ? <span className="shop-card__stock">Out of stock</span> : null}
        </div>

        <button
          type="button"
          className="shop-card__icon shop-card__icon--cart"
          aria-label={added ? 'Added to cart' : 'Add to cart'}
          disabled={!inStock || added}
          onClick={onAddToCart}
        >
          {added ? <Check size={22} strokeWidth={2.5} /> : <ShoppingCart size={22} strokeWidth={2} />}
        </button>
      </div>

      {onSelect ? (
        <button type="button" className="shop-card__title-btn" onClick={onSelect}>
          {name}
        </button>
      ) : (
        <p className="shop-card__title">{name}</p>
      )}
    </article>
  );
}

'use client';

import PageHero from '@/components/PageHero';
import ShopProductCard from '@/components/ShopProductCard';
import type { Product as EstoreProduct } from '@/content/estoreProducts';
import { useCart } from '@/context/CartContext';
const ESTORE_STRIP = [
  { icon: '✦', label: 'Lab certified gems' },
  { icon: '☸', label: 'Energized yantras' },
  { icon: '📿', label: 'Blessed malas' },
  { icon: '🔮', label: 'Expert guidance' },
] as const;

type Props = {
  products?: EstoreProduct[];
};

export default function EstorePage({ products = [] }: Props) {
  const { addedItems, handleAddToCart } = useCart();

  return (
    <div className="page-section page-section--estore">
      <PageHero
        variant="store"
        subtitle="Sacred remedies"
        title={
          <>
            Vedic <span>E-Remedies</span> Store
          </>
        }
        description="100% natural, certified gemstones, spiritual malas, and energized Yantras designed to correct astrological imbalances."
      />

      <div className="inner-feature-strip" data-reveal="fade-up" data-reveal-stagger>
        {ESTORE_STRIP.map((item) => (
          <div className="inner-feature-strip__item" key={item.label}>
            <span className="inner-feature-strip__icon" aria-hidden>
              {item.icon}
            </span>
            <span className="inner-feature-strip__label">{item.label}</span>
          </div>
        ))}
      </div>

      <h2 className="title-shop" data-reveal="glow-in">
        Shop
      </h2>
      <div className="shop-cards-grid" data-reveal="fade-up" data-reveal-stagger>
        {products.map((prod, index) => (
          <ShopProductCard
            key={prod.id}
            name={prod.name}
            category={prod.category}
            price={prod.price}
            originalPrice={prod.originalPrice}
            image={prod.image}
            iconText={prod.iconText}
            iconBg={prod.iconBg}
            themeIndex={index}
            added={!!addedItems[prod.id]}
            onAddToCart={() =>
              handleAddToCart({
                productId: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

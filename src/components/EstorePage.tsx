'use client';

import { Check, ShoppingCart } from 'lucide-react';
import { estoreProducts } from '@/content/estoreProducts';
import { useCart } from '@/context/CartContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function EstorePage() {
  const { addedItems, handleAddToCart } = useCart();
  useScrollReveal(['/estore']);

  return (
    <div className="page-section">
      <div className="section-header" data-reveal="fade-up">
        <h2 className="section-title">
          Vedic <span>E-Remedies</span> Store
        </h2>
        <p className="section-desc">
          100% natural, certified, and chemically verified gemstones, spiritual malas, and energized Yantras designed
          to correct astrological imbalances.
        </p>
      </div>

      <div className="store-grid" data-reveal="fade-up" data-reveal-stagger>
        {estoreProducts.map((prod) => (
          <div className="product-card" key={prod.id}>
            <div className="product-img-wrapper">
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '24px',
                  background: prod.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
              >
                {prod.iconText}
              </div>
              <span className="product-badge">{prod.category}</span>
            </div>
            <div className="product-info">
              <span className="product-category">{prod.category}</span>
              <h3 className="product-name">{prod.name}</h3>
              <p className="product-desc">{prod.desc}</p>
              <div className="product-footer">
                <span className="product-price">Rs. {prod.price}</span>
                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(prod.id)}
                  disabled={addedItems[prod.id]}
                  title="Add to sacred cart"
                  type="button"
                >
                  {addedItems[prod.id] ? <Check size={18} /> : <ShoppingCart size={18} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

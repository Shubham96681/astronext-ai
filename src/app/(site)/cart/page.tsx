'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ROUTES } from '@/routes/paths';

export default function CartPage() {
  const { user, isLoading } = useAuth();
  const { cartItems, subtotal, cartCount, incrementQty, decrementQty, removeFromCart } = useCart();
  const checkoutHref = useMemo(() => {
    if (isLoading || user) return ROUTES.checkout;
    return `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.checkout)}`;
  }, [isLoading, user]);

  return (
    <section className="cart-page site-shell">
      <header className="cart-page__header">
        <p className="cart-page__eyebrow">Astronext Divine Store</p>
        <h1 className="cart-page__title">Your Cart</h1>
        <p className="cart-page__subtitle">{cartCount} sacred item(s) ready for checkout</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-page__empty">
          <p>Your cart is empty.</p>
          <Link href={ROUTES.divineStore} className="cart-page__link">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="cart-page__layout">
          <div className="cart-page__list">
            {cartItems.map((item) => (
              <article key={item.productId} className="cart-line">
                <div className="cart-line__thumb">
                  {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <span aria-hidden>🛍</span>}
                </div>
                <div className="cart-line__meta">
                  <h2 className="cart-line__name">{item.name}</h2>
                  <p className="cart-line__price">₹{item.price.toLocaleString('en-IN')}</p>
                  <div className="cart-line__qty">
                    <button type="button" aria-label="Decrease quantity" onClick={() => decrementQty(item.productId)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => incrementQty(item.productId)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="cart-line__remove"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div className="cart-summary__row">
              <span>Tax</span>
              <strong>₹0.00</strong>
            </div>
            <div className="cart-summary__delivery">Free delivery on orders above ₹500</div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <Link href={checkoutHref} className="cart-summary__cta">
              {isLoading ? 'Checking session…' : user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

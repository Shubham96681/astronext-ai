'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { initPayuCheckout, redirectToPayu, validateCartWithShopify } from '@/lib/payments';
import { ROUTES } from '@/routes/paths';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<'payonline' | 'cod'>('payonline');
  const [coupon, setCoupon] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState<'8-11' | '1-6'>('8-11');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const totalQty = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems]);
  const delivery = useMemo(() => (subtotal >= 500 ? 0 : 49), [subtotal]);
  const total = subtotal + delivery;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.checkout)}`);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <section className="cart-page site-shell">
        <div className="cart-page__empty">
          <p>Checking your session…</p>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-page site-shell">
        <header className="cart-page__header">
          <p className="cart-page__eyebrow">Astronext Divine Store</p>
          <h1 className="cart-page__title">Checkout</h1>
        </header>
        <div className="cart-page__empty">
          <p>No items to checkout yet.</p>
          <Link href={ROUTES.cart} className="cart-page__link">
            Go to cart
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page site-shell">
      <header className="checkout-head">
        <div>
          <p className="cart-page__eyebrow">Secure checkout</p>
          <h1 className="cart-page__title">Complete Checkout</h1>
          <p className="cart-page__subtitle">Secure, frictionless payments in 1 click</p>
        </div>
        <div className="checkout-head__stats">
          <p>
            Distance <strong>28.0 km</strong>
          </p>
          <p>
            ETA <strong>1 hr 12 mins</strong>
          </p>
          <p>
            Delivery <strong>{delivery === 0 ? 'Free' : `₹${delivery}`}</strong>
          </p>
        </div>
      </header>

      <form
        className="checkout-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          if (submitting) return;
          if (!name || !phone || !address) {
            setSubmitError('Please enter name, phone, and delivery address before payment.');
            setIsEditingAddress(true);
            return;
          }
          setSubmitError('');
          setSubmitting(true);
          try {
            const shopifyItems = await validateCartWithShopify(
              cartItems.map((item) => ({
                product_id: item.productId,
                name: item.name,
                price: item.price,
                qty: item.qty,
              })),
            );
            const shopifySubtotal = shopifyItems.reduce((sum, item) => sum + item.price * item.qty, 0);
            const shopifyTotal = shopifySubtotal + delivery;

            const result = await initPayuCheckout({
              customer_name: name,
              phone,
              address,
              payment_method: payment,
              items: shopifyItems,
              subtotal: shopifySubtotal,
              delivery,
              total: shopifyTotal,
              delivery_slot: deliverySlot,
              coupon: coupon || undefined,
            });

            clearCart();

            if (result.cod) {
              router.push(`${ROUTES.checkoutSuccess}?txnid=${encodeURIComponent(result.txnid)}`);
              return;
            }

            if (!result.payu_action || !result.payu_fields?.length) {
              throw new Error('PayU payment details missing');
            }

            redirectToPayu(result.payu_action, result.payu_fields);
          } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Checkout failed');
            setSubmitting(false);
          }
        }}
      >
        <section className="checkout-col">
          {!isEditingAddress ? (
            <>
              <article className="checkout-card">
                <header className="checkout-card__head">
                  <p className="checkout-card__title">
                    <MapPin size={16} /> Driving to
                  </p>
                  <div className="checkout-card__actions">
                    <button type="button" className="checkout-chip" onClick={() => setIsEditingAddress(true)}>
                      Edit
                    </button>
                    <button type="button" className="checkout-chip">
                      Change
                    </button>
                  </div>
                </header>
                <div className="checkout-address-view">
                  <p className="checkout-address-view__name">{name || 'Admin User'}</p>
                  <p className="checkout-address-view__text">{address || 'Flat 4b, flat, hrs layout'}</p>
                  <p className="checkout-address-view__phone">{phone || '+91 98765 43210'}</p>
                </div>
              </article>

              <article className="checkout-card">
                <header className="checkout-card__head">
                  <p className="checkout-card__title">Delivery Slot</p>
                  <span className="checkout-card__meta">Delivering in 1 hr 12 mins</span>
                </header>
                <div className="checkout-slot-list">
                  <button
                    type="button"
                    className={`checkout-slot${deliverySlot === '8-11' ? ' is-active' : ''}`}
                    onClick={() => setDeliverySlot('8-11')}
                  >
                    8am - 11am
                  </button>
                  <button
                    type="button"
                    className={`checkout-slot${deliverySlot === '1-6' ? ' is-active' : ''}`}
                    onClick={() => setDeliverySlot('1-6')}
                  >
                    1pm - 6pm
                  </button>
                </div>
              </article>
            </>
          ) : (
            <>
              <article className="checkout-card">
                <header className="checkout-card__head">
                  <p className="checkout-card__title">
                    <MapPin size={16} /> Saved Addresses
                  </p>
                  <button type="button" className="checkout-chip" onClick={() => setIsEditingAddress(false)}>
                    Close Edit
                  </button>
                </header>
                <div className="checkout-empty-address">
                  <MapPin size={18} />
                  <p>No saved addresses</p>
                  <span>Add an address to speed up checkout.</span>
                  <button type="button" className="checkout-chip checkout-chip--solid">
                    Add New Address
                  </button>
                </div>
              </article>

              <article className="checkout-card">
                <header className="checkout-card__head">
                  <p className="checkout-card__title">
                    <MapPin size={16} /> New Address Details
                  </p>
                </header>
                <div className="checkout-form">
                  <label>
                    Full Name
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                  </label>
                  <label>
                    Phone Number
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </label>
                  <label>
                    Delivery Address
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4} required />
                  </label>
                </div>
              </article>
            </>
          )}
        </section>

        <section className="checkout-col">
          <article className="checkout-card">
            <header className="checkout-card__head">
              <p className="checkout-card__title">
                <CreditCard size={16} /> Payment Method
              </p>
            </header>
            <div className="checkout-payments">
              <button
                type="button"
                className={`checkout-payopt${payment === 'payonline' ? ' is-active' : ''}`}
                onClick={() => setPayment('payonline')}
              >
                <Wallet size={16} /> Pay Online
              </button>
              <button
                type="button"
                className={`checkout-payopt${payment === 'cod' ? ' is-active' : ''}`}
                onClick={() => setPayment('cod')}
              >
                <ShieldCheck size={16} /> Cash on Delivery
              </button>
            </div>
          </article>

          <article className="checkout-card">
            <header className="checkout-card__head">
              <p className="checkout-card__title">Coupons & Offers</p>
            </header>
            <div className="checkout-coupon">
              <input
                placeholder="Enter promo code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button type="button">Apply</button>
            </div>
            <p className="checkout-offer-note">No available offers at the moment.</p>
          </article>
        </section>

        <aside className="checkout-col">
          <article className="checkout-card">
            <header className="checkout-card__head">
              <p className="checkout-card__title">Order Items</p>
              <span className="checkout-card__meta">{totalQty} item(s)</span>
            </header>
            <div className="checkout-lines">
              {cartItems.map((item) => (
                <div key={item.productId} className="checkout-line">
                  <span>{item.name}</span>
                  <strong>
                    {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}
            </div>

            <div className="cart-summary__row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div className="cart-summary__row">
              <span>Delivery charges</span>
              <strong>{delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}</strong>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total Payable</span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>

            {submitError && <p className="checkout-offer-note" style={{ color: '#dc2626' }}>{submitError}</p>}
            <button type="submit" className="cart-summary__cta" disabled={submitting}>
              {submitting
                ? 'Processing…'
                : payment === 'cod'
                  ? 'Place COD Order'
                  : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
            <Link href={ROUTES.cart} className="checkout-back-link">
              Back to cart
            </Link>
          </article>
        </aside>
      </form>
    </section>
  );
}

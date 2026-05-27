'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { XCircle } from 'lucide-react';
import { ROUTES } from '@/routes/paths';

function FailureContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid');
  const reason = searchParams.get('reason');

  return (
    <section className="cart-page site-shell">
      <div className="cart-page__empty" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <XCircle size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h1 className="cart-page__title">Payment failed</h1>
        <p>Your payment could not be completed. No amount was charged.</p>
        {txnid && (
          <p className="cart-page__subtitle">
            Transaction ID: <strong>{txnid}</strong>
          </p>
        )}
        {reason && <p className="checkout-offer-note">Reason: {reason.replace(/_/g, ' ')}</p>}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
          }}
        >
          <Link
            href={ROUTES.checkout}
            className="cart-page__link"
            style={{ display: 'inline-block', marginTop: 0, lineHeight: 1.2 }}
          >
            Try again
          </Link>
          <Link
            href={ROUTES.cart}
            className="checkout-back-link"
            style={{ display: 'inline-block', marginTop: 0, lineHeight: 1.2 }}
          >
            Back to cart
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<section className="cart-page site-shell"><p>Loading…</p></section>}>
      <FailureContent />
    </Suspense>
  );
}

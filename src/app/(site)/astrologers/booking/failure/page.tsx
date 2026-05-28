'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { ROUTES } from '@/routes/paths';

function BookingFailure() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') ?? '';
  const reason = searchParams.get('reason') ?? '';

  return (
    <section className="cart-page site-shell">
      <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
        <XCircle size={56} color="#dc2626" style={{ margin: '0 auto 1.25rem' }} />
        <h1 className="cart-page__title">Payment Failed</h1>
        <p>
          {reason === 'invalid_hash'
            ? 'Payment verification failed. Please try again.'
            : 'Your payment could not be processed. No amount has been charged.'}
        </p>
        {txnid && (
          <p className="cart-page__subtitle" style={{ fontSize: '0.8rem', color: '#888' }}>
            Ref: {txnid}
          </p>
        )}
        <Link href={ROUTES.astrologers} className="cart-page__link" style={{ marginTop: '2rem', display: 'inline-block' }}>
          Try again
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<section className="cart-page site-shell"><p>Loading…</p></section>}>
      <BookingFailure />
    </Suspense>
  );
}

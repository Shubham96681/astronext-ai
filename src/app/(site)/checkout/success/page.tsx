'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { fetchOrderStatus, type OrderStatusResponse } from '@/lib/payments';
import { ROUTES } from '@/routes/paths';

function SuccessContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') ?? '';
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!txnid) return;
    fetchOrderStatus(txnid)
      .then(setOrder)
      .catch(() => setError('Could not load order details.'));
  }, [txnid]);

  return (
    <section className="cart-page site-shell">
      <div className="cart-page__empty" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
        <h1 className="cart-page__title">Payment successful</h1>
        <p>Thank you for your order{order ? `, ${order.customer_name}` : ''}.</p>
        {txnid && (
          <p className="cart-page__subtitle">
            Transaction ID: <strong>{txnid}</strong>
          </p>
        )}
        {order && (
          <p className="cart-page__subtitle">
            Amount paid: <strong>₹{order.amount_inr.toLocaleString('en-IN')}</strong>
          </p>
        )}
        {error && <p className="checkout-offer-note">{error}</p>}
        <Link href={ROUTES.divineStore} className="cart-page__link" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<section className="cart-page site-shell"><p>Loading…</p></section>}>
      <SuccessContent />
    </Suspense>
  );
}

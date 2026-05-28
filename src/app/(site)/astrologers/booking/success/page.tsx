'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { fetchConsultationStatus, type ConsultationStatusResponse } from '@/lib/consultationPayments';
import { ROUTES } from '@/routes/paths';

function BookingSuccess() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') ?? '';
  const [booking, setBooking] = useState<ConsultationStatusResponse | null>(null);

  useEffect(() => {
    if (!txnid) return;
    fetchConsultationStatus(txnid).then(setBooking).catch(() => null);
  }, [txnid]);

  return (
    <section className="cart-page site-shell">
      <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
        <CheckCircle2 size={56} color="#16a34a" style={{ margin: '0 auto 1.25rem' }} />
        <h1 className="cart-page__title">Booking Confirmed!</h1>
        {booking ? (
          <>
            <p>Your consultation with <strong>{booking.astrologer_name}</strong> is booked.</p>
            <p className="cart-page__subtitle">
              Duration: <strong>{booking.duration_minutes} minutes</strong> ·{' '}
              Amount paid: <strong>₹{booking.amount_inr.toLocaleString('en-IN')}</strong>
            </p>
          </>
        ) : (
          <p>Your payment was successful. You will be contacted shortly.</p>
        )}
        {txnid && (
          <p className="cart-page__subtitle" style={{ fontSize: '0.8rem', color: '#888' }}>
            Ref: {txnid}
          </p>
        )}
        <Link href={ROUTES.astrologers} className="cart-page__link" style={{ marginTop: '2rem', display: 'inline-block' }}>
          Browse more astrologers
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<section className="cart-page site-shell"><p>Loading…</p></section>}>
      <BookingSuccess />
    </Suspense>
  );
}

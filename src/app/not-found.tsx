'use client';

import Link from 'next/link';
import { ZODIAC_WHEEL_SRC } from '@/lib/imageSrc';

export default function NotFound() {
  return (
    <main className="not-found-page page-section">
      <img src={ZODIAC_WHEEL_SRC} alt="" className="not-found-page__wheel zodiac-wheel-asset" width={120} height={120} />
      <h1>Page not found</h1>
      <p>The stars could not align with this path.</p>
      <Link href="/" className="not-found-page__cta">
        Return to AstroNext home
      </Link>
    </main>
  );
}

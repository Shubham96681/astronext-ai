import { NextResponse } from 'next/server';

import { getDivineStoreProducts, getEstoreProducts } from '@/lib/storeProducts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get('store') ?? 'divine';

  try {
    if (store === 'estore') {
      const data = await getEstoreProducts();
      return NextResponse.json(data);
    }
    const data = await getDivineStoreProducts();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

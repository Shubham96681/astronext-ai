import { NextResponse } from 'next/server';

import { fetchProductById, isShopifyConfigured, parseShopifyGid } from '@/lib/shopify/client';
import { mapShopifyToJgProduct } from '@/lib/shopify/mapProduct';

type CartLineInput = {
  product_id: number;
  name: string;
  price: number;
  qty: number;
};

/** Re-price cart lines from Shopify so checkout uses live store prices. */
export async function POST(request: Request) {
  const body = (await request.json()) as { items?: CartLineInput[] };
  const items = body.items ?? [];

  if (items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!isShopifyConfigured()) {
    return NextResponse.json({ items, source: 'client' });
  }

  const validated: CartLineInput[] = [];
  for (const line of items) {
    try {
      const node = await fetchProductById(line.product_id);
      if (!node) {
        return NextResponse.json(
          { error: `Product ${line.product_id} is no longer available` },
          { status: 400 },
        );
      }
      const product = mapShopifyToJgProduct(node);
      if (!product.inStock) {
        return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 });
      }
      validated.push({
        product_id: parseShopifyGid(node.id),
        name: product.name,
        price: product.price,
        qty: line.qty,
      });
    } catch {
      validated.push(line);
    }
  }

  return NextResponse.json({ items: validated, source: 'shopify' });
}

import type { JgProduct } from '@/content/jgStoreProducts';
import type { Product as EstoreProduct } from '@/content/estoreProducts';
import { parseShopifyGid } from '@/lib/shopify/client';
import type { ShopifyProductNode } from '@/lib/shopify/types';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toInrPrice(amount: string, currency: string): number {
  const value = Math.round(parseFloat(amount) || 0);
  if (currency === 'INR') return value;
  return value;
}

function firstImage(node: ShopifyProductNode): string {
  return node.images.edges[0]?.node.url ?? '';
}

export function mapShopifyToJgProduct(node: ShopifyProductNode, collectionTitle?: string): JgProduct {
  const price = toInrPrice(
    node.priceRange.minVariantPrice.amount,
    node.priceRange.minVariantPrice.currencyCode,
  );
  const plainDesc = stripHtml(node.description || '');
  const shortDesc =
    plainDesc.length > 160 ? `${plainDesc.slice(0, 157)}…` : plainDesc || node.title;

  return {
    id: parseShopifyGid(node.id),
    name: node.title,
    category: node.productType || collectionTitle || 'Divine Store',
    price,
    desc: shortDesc,
    descLong: plainDesc || shortDesc,
    rating: 4.9,
    reviews: 0,
    inStock: node.availableForSale,
    image: firstImage(node),
  };
}

export function mapShopifyToEstoreProduct(node: ShopifyProductNode, index: number): EstoreProduct {
  const price = toInrPrice(
    node.priceRange.minVariantPrice.amount,
    node.priceRange.minVariantPrice.currencyCode,
  );
  const compare = node.compareAtPriceRange?.minVariantPrice;
  const originalPrice = compare ? toInrPrice(compare.amount, compare.currencyCode) : undefined;
  const plainDesc = stripHtml(node.description || '');

  const themes = [
    'radial-gradient(circle, #3d5afe 0%, #1a237e 100%)',
    'radial-gradient(circle, #7b1fa2 0%, #4a148c 100%)',
    'radial-gradient(circle, #f57c00 0%, #e65100 100%)',
    'radial-gradient(circle, #00897b 0%, #004d40 100%)',
  ];

  return {
    id: parseShopifyGid(node.id),
    name: node.title,
    category: node.productType || 'remedy',
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    discount:
      originalPrice && originalPrice > price
        ? `${Math.round((1 - price / originalPrice) * 100)}% Off`
        : undefined,
    desc: plainDesc || node.title,
    rating: 4.9,
    iconBg: themes[index % themes.length],
    iconText: '✦',
    image: firstImage(node),
  };
}

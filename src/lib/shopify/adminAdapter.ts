import type { AdminProductNode } from '@/lib/shopify/adminTypes';
import type { ShopifyProductNode } from '@/lib/shopify/types';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function adminProductToStorefrontShape(node: AdminProductNode): ShopifyProductNode {
  const variant = node.variants.edges[0]?.node;
  const price = variant?.price ?? '0';
  const compareAt = variant?.compareAtPrice ?? null;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: stripHtml(node.descriptionHtml || ''),
    productType: node.productType || '',
    availableForSale: variant?.availableForSale ?? node.status === 'ACTIVE',
    priceRange: {
      minVariantPrice: {
        amount: price,
        currencyCode: 'INR',
      },
    },
    compareAtPriceRange: compareAt
      ? {
          minVariantPrice: {
            amount: compareAt,
            currencyCode: 'INR',
          },
        }
      : undefined,
    images: {
      edges: node.featuredImage
        ? [{ node: { url: node.featuredImage.url, altText: node.featuredImage.altText } }]
        : [],
    },
  };
}

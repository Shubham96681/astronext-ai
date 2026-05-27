import { SHOPIFY_DEFAULTS } from '@/lib/shopify/defaults';
import type { ShopifyProductNode } from '@/lib/shopify/types';

export type StorefrontJsonProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  product_type: string;
  vendor: string;
  variants: Array<{
    price: string;
    compare_at_price: string | null;
    available: boolean;
  }>;
  images: Array<{ src: string }>;
};

type CollectionsJson = {
  collections: Array<{ id: number; title: string; handle: string }>;
};

type CollectionProductsJson = {
  products: StorefrontJsonProduct[];
};

const collectionMetaById = new Map<string, { handle: string; title: string }>();

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getStoreBaseUrl(): string {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN?.trim() ||
    process.env.SHOPIFY_SHOP_DOMAIN?.trim() ||
    SHOPIFY_DEFAULTS.storeDomain;
  const host = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${host}`;
}

function collectionNumericId(collectionId: string): string {
  return collectionId.split('/').pop() ?? collectionId;
}

export async function resolveCollectionHandle(collectionId: string): Promise<string> {
  const defaultCollectionId =
    process.env.SHOPIFY_COLLECTION_ID?.trim() || SHOPIFY_DEFAULTS.collectionId;
  const estoreCollectionId =
    process.env.SHOPIFY_ESTORE_COLLECTION_ID?.trim() || defaultCollectionId;

  if (collectionId === defaultCollectionId) {
    return (
      process.env.SHOPIFY_COLLECTION_HANDLE?.trim() || SHOPIFY_DEFAULTS.collectionHandle
    );
  }
  if (collectionId === estoreCollectionId && process.env.SHOPIFY_ESTORE_COLLECTION_HANDLE?.trim()) {
    return process.env.SHOPIFY_ESTORE_COLLECTION_HANDLE.trim();
  }

  const numericId = collectionNumericId(collectionId);
  const cached = collectionMetaById.get(numericId);
  if (cached) return cached.handle;

  const base = getStoreBaseUrl();
  const res = await fetch(`${base}/collections.json`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Shopify collections.json ${res.status}`);
  }

  const json = (await res.json()) as CollectionsJson;
  const match = json.collections.find((c) => String(c.id) === numericId);
  if (!match) {
    throw new Error(`Collection ${collectionId} not found on ${base}`);
  }

  collectionMetaById.set(numericId, { handle: match.handle, title: match.title });
  return match.handle;
}

function collectionTitleForId(collectionId: string): string | undefined {
  const numericId = collectionNumericId(collectionId);
  return collectionMetaById.get(numericId)?.title;
}

export function storefrontJsonToShopifyNode(product: StorefrontJsonProduct): ShopifyProductNode {
  const variant = product.variants[0];
  const price = variant?.price ?? '0';
  const compareAt = variant?.compare_at_price ?? null;

  return {
    id: `gid://shopify/Product/${product.id}`,
    title: product.title,
    handle: product.handle,
    description: stripHtml(product.body_html || ''),
    productType: product.product_type || '',
    availableForSale: variant?.available ?? true,
    priceRange: {
      minVariantPrice: { amount: price, currencyCode: 'INR' },
    },
    compareAtPriceRange: compareAt
      ? { minVariantPrice: { amount: compareAt, currencyCode: 'INR' } }
      : undefined,
    images: {
      edges: (product.images[0]
        ? [{ node: { url: product.images[0].src, altText: product.title } }]
        : []) as ShopifyProductNode['images']['edges'],
    },
  };
}

async function fetchCollectionProductsJson(
  collectionHandle: string,
  collectionTitle?: string,
): Promise<{ collectionTitle: string; products: ShopifyProductNode[] }> {
  const base = getStoreBaseUrl();
  const res = await fetch(`${base}/collections/${collectionHandle}/products.json`, {
    headers: { Accept: 'application/json' },
    ...(process.env.VERCEL
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 300 } }),
  });

  if (!res.ok) {
    throw new Error(`Shopify collection products.json ${res.status} (${collectionHandle})`);
  }

  const json = (await res.json()) as CollectionProductsJson;
  const products = json.products.map(storefrontJsonToShopifyNode);

  return {
    collectionTitle: collectionTitle ?? collectionHandle.replace(/-/g, ' '),
    products,
  };
}

export async function fetchCollectionProductsStorefrontJson(
  collectionId: string,
): Promise<{ collectionTitle: string; products: ShopifyProductNode[] }> {
  const handle = await resolveCollectionHandle(collectionId);
  const title = collectionTitleForId(collectionId);
  return fetchCollectionProductsJson(handle, title);
}

export async function fetchProductByHandleStorefrontJson(
  handle: string,
): Promise<ShopifyProductNode | null> {
  const base = getStoreBaseUrl();
  const res = await fetch(`${base}/products/${handle}.json`, { next: { revalidate: 300 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Shopify product.json ${res.status} (${handle})`);
  }

  const json = (await res.json()) as { product: StorefrontJsonProduct };
  return storefrontJsonToShopifyNode(json.product);
}

export async function fetchProductByIdStorefrontJson(
  productId: number,
  collectionId?: string,
): Promise<ShopifyProductNode | null> {
  const { collectionId: defaultId } = {
    collectionId: process.env.SHOPIFY_COLLECTION_ID ?? 'gid://shopify/Collection/321156776094',
  };
  const id = collectionId ?? defaultId;
  const { products } = await fetchCollectionProductsStorefrontJson(id);
  const found = products.find((p) => p.id.endsWith(`/${productId}`));
  if (found) return found;

  const base = getStoreBaseUrl();
  const res = await fetch(`${base}/products.json?limit=250`, { next: { revalidate: 300 } });
  if (!res.ok) return null;

  const json = (await res.json()) as CollectionProductsJson;
  const match = json.products.find((p) => p.id === productId);
  return match ? storefrontJsonToShopifyNode(match) : null;
}

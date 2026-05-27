import { resolveAdminAccessToken } from '@/lib/shopify/accessToken';
import { SHOPIFY_DEFAULTS } from '@/lib/shopify/defaults';
import {
  ADMIN_COLLECTION_PRODUCTS_QUERY,
  ADMIN_PRODUCT_BY_ID_QUERY,
} from '@/lib/shopify/adminQueries';
import { adminProductToStorefrontShape } from '@/lib/shopify/adminAdapter';
import type { AdminCollectionResponse, AdminProductResponse } from '@/lib/shopify/adminTypes';
import { COLLECTION_PRODUCTS_QUERY, PRODUCT_BY_ID_QUERY } from '@/lib/shopify/queries';
import {
  fetchCollectionProductsStorefrontJson,
  fetchProductByIdStorefrontJson,
} from '@/lib/shopify/storefrontJson';
import type {
  ShopifyCollectionResponse,
  ShopifyProductNode,
  ShopifyProductResponse,
} from '@/lib/shopify/types';

export type ShopifyApiMode = 'admin' | 'storefront' | 'storefront-json' | 'none';

function getConfig() {
  const storefrontDomain =
    process.env.SHOPIFY_STORE_DOMAIN?.trim() || SHOPIFY_DEFAULTS.storeDomain;
  const shopDomain =
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim() ||
    process.env.SHOPIFY_SHOP_DOMAIN?.trim() ||
    SHOPIFY_DEFAULTS.myshopifyDomain;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() ?? '';
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim() ?? '';
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || SHOPIFY_DEFAULTS.apiVersion;
  const collectionId =
    process.env.SHOPIFY_COLLECTION_ID?.trim() || SHOPIFY_DEFAULTS.collectionId;
  const collectionHandle =
    process.env.SHOPIFY_COLLECTION_HANDLE?.trim() || SHOPIFY_DEFAULTS.collectionHandle;

  return {
    storefrontDomain,
    shopDomain,
    storefrontToken,
    adminToken,
    apiVersion,
    collectionId,
    collectionHandle,
  };
}

/** shpss_ is the API secret — never use it as an access token. */
export function isValidAdminToken(token: string): boolean {
  const t = token.trim();
  if (!t || t.startsWith('shpss_')) return false;
  return t.startsWith('shpat_') || t.length >= 32;
}

export function isShopifyConfigured(): boolean {
  const { storefrontToken, adminToken, collectionId, storefrontDomain } = getConfig();
  const validAdmin = Boolean(adminToken && isValidAdminToken(adminToken));
  const validStorefront = Boolean(storefrontToken);
  const hasOAuthCreds = Boolean(
    process.env.SHOPIFY_API_KEY?.trim() && process.env.SHOPIFY_API_SECRET?.trim(),
  );
  // Use resolved config (includes production defaults), not raw process.env — required for Vercel.
  const hasPublicStore = Boolean(storefrontDomain && collectionId);
  return validAdmin || validStorefront || hasOAuthCreds || hasPublicStore;
}

export async function shopifyApiMode(): Promise<ShopifyApiMode> {
  const { adminToken, storefrontToken } = getConfig();
  if (adminToken && isValidAdminToken(adminToken)) return 'admin';

  const hasOAuth = Boolean(
    process.env.SHOPIFY_API_KEY?.trim() && process.env.SHOPIFY_API_SECRET?.trim(),
  );
  if (hasOAuth) {
    const resolved = await resolveAdminAccessToken();
    if (resolved && isValidAdminToken(resolved)) return 'admin';
    if (resolved) {
      console.warn('[Shopify] OAuth token received but format unexpected — using storefront fallback');
    }
  }

  if (storefrontToken) return 'storefront';
  const { collectionId, storefrontDomain } = getConfig();
  if (collectionId && storefrontDomain) return 'storefront-json';
  return 'none';
}

export function shopifyConfigWarning(): string | null {
  const { adminToken } = getConfig();
  if (adminToken && !isValidAdminToken(adminToken)) {
    return 'SHOPIFY_ADMIN_ACCESS_TOKEN looks like an API secret (shpss_). Use the Admin API access token (shpat_…) from Shopify app credentials.';
  }
  return null;
}

async function storefrontFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { storefrontDomain, storefrontToken, apiVersion } = getConfig();
  if (!storefrontToken) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured');
  }

  const host = storefrontDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const url = `https://${host}/api/${apiVersion}/graphql.json`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Storefront API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { shopDomain, apiVersion } = getConfig();
  const adminToken = await resolveAdminAccessToken();
  if (!adminToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured');
  }

  const host = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const adminHost = host.includes('.myshopify.com')
    ? host
    : (process.env.SHOPIFY_MYSHOPIFY_DOMAIN ?? '00mi0h-6k.myshopify.com').replace(
        /^https?:\/\//,
        '',
      );
  const url = `https://${adminHost}/admin/api/${apiVersion}/graphql.json`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

export function parseShopifyGid(gid: string): number {
  const segment = gid.split('/').pop() ?? '0';
  const n = Number(segment);
  return Number.isFinite(n) ? n : 0;
}

export function toProductGid(numericId: number): string {
  return `gid://shopify/Product/${numericId}`;
}

async function fetchCollectionProductsAdmin(
  collectionId: string,
  first: number,
): Promise<{ collectionTitle: string; products: ShopifyProductNode[] }> {
  const json = await adminFetch<AdminCollectionResponse>(ADMIN_COLLECTION_PRODUCTS_QUERY, {
    id: collectionId,
    first,
  });

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  const collection = json.data?.collection;
  if (!collection) {
    throw new Error('Collection not found in Shopify Admin API');
  }

  return {
    collectionTitle: collection.title,
    products: collection.products.edges.map((e) => adminProductToStorefrontShape(e.node)),
  };
}

async function fetchCollectionProductsStorefront(
  collectionId: string,
  first: number,
): Promise<{ collectionTitle: string; products: ShopifyProductNode[] }> {
  const json = await storefrontFetch<ShopifyCollectionResponse>(COLLECTION_PRODUCTS_QUERY, {
    id: collectionId,
    first,
  });

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  const collection = json.data?.collection;
  if (!collection) {
    throw new Error('Collection not found in Shopify Storefront API');
  }

  return {
    collectionTitle: collection.title,
    products: collection.products.edges.map((e) => e.node),
  };
}

export async function fetchCollectionProducts(
  collectionId?: string,
  first = 50,
): Promise<{ collectionTitle: string; products: ShopifyProductNode[] }> {
  const { collectionId: defaultId } = getConfig();
  const id = collectionId ?? defaultId;
  const mode = await shopifyApiMode();

  if (mode === 'admin') {
    return fetchCollectionProductsAdmin(id, first);
  }
  if (mode === 'storefront') {
    return fetchCollectionProductsStorefront(id, first);
  }
  return fetchCollectionProductsStorefrontJson(id);
}

async function fetchProductByIdAdmin(productId: number): Promise<ShopifyProductNode | null> {
  const json = await adminFetch<AdminProductResponse>(ADMIN_PRODUCT_BY_ID_QUERY, {
    id: toProductGid(productId),
  });

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  const product = json.data?.product;
  return product ? adminProductToStorefrontShape(product) : null;
}

async function fetchProductByIdStorefront(productId: number): Promise<ShopifyProductNode | null> {
  const json = await storefrontFetch<ShopifyProductResponse>(PRODUCT_BY_ID_QUERY, {
    id: toProductGid(productId),
  });

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  return json.data?.product ?? null;
}

export async function fetchProductById(
  productId: number,
  collectionId?: string,
): Promise<ShopifyProductNode | null> {
  const mode = await shopifyApiMode();
  if (mode === 'admin') {
    return fetchProductByIdAdmin(productId);
  }
  if (mode === 'storefront') {
    return fetchProductByIdStorefront(productId);
  }
  return fetchProductByIdStorefrontJson(productId, collectionId);
}

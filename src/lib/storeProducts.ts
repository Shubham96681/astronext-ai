import type { JgProduct } from '@/content/jgStoreProducts';
import type { Product as EstoreProduct } from '@/content/estoreProducts';
import {
  fetchCollectionProducts,
  fetchProductById,
  isShopifyConfigured,
  shopifyConfigWarning,
} from '@/lib/shopify/client';
import { mapShopifyToEstoreProduct, mapShopifyToJgProduct } from '@/lib/shopify/mapProduct';
import { SHOPIFY_DEFAULTS } from '@/lib/shopify/defaults';

export type StoreSource = 'shopify' | 'static';

export type DivineStorePayload = {
  products: JgProduct[];
  source: StoreSource;
  collectionTitle?: string;
  shopifyWarning?: string | null;
};

export type EstorePayload = {
  products: EstoreProduct[];
  source: StoreSource;
  collectionTitle?: string;
  shopifyWarning?: string | null;
};

function estoreCollectionId(): string {
  return (
    process.env.SHOPIFY_ESTORE_COLLECTION_ID?.trim() ||
    process.env.SHOPIFY_COLLECTION_ID?.trim() ||
    SHOPIFY_DEFAULTS.collectionId
  );
}

export async function getDivineStoreProducts(): Promise<DivineStorePayload> {
  const configWarning = shopifyConfigWarning();

  if (!isShopifyConfigured()) {
    return {
      products: [],
      source: 'static',
      shopifyWarning: configWarning ?? 'Shopify is not configured.',
    };
  }

  try {
    const { collectionTitle, products } = await fetchCollectionProducts();
    const mapped = products.map((p) => mapShopifyToJgProduct(p, collectionTitle));
    if (mapped.length === 0) {
      return {
        products: [],
        source: 'static',
        shopifyWarning: 'No products returned from Shopify for this collection.',
      };
    }
    return {
      products: mapped,
      source: 'shopify',
      collectionTitle,
      shopifyWarning: configWarning,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Shopify fetch failed';
    console.error('[Shopify] divine store fetch failed:', msg);
    return { products: [], source: 'static', shopifyWarning: configWarning ?? msg };
  }
}

export async function getEstoreProducts(): Promise<EstorePayload> {
  const configWarning = shopifyConfigWarning();
  const collectionId = estoreCollectionId();

  if (!isShopifyConfigured()) {
    return {
      products: [],
      source: 'static',
      shopifyWarning: configWarning ?? 'Shopify is not configured.',
    };
  }

  try {
    const { collectionTitle, products } = await fetchCollectionProducts(collectionId);
    const mapped = products.map((p, i) => mapShopifyToEstoreProduct(p, i));
    if (mapped.length === 0) {
      return {
        products: [],
        source: 'static',
        shopifyWarning: 'No products returned from Shopify for this collection.',
      };
    }
    return {
      products: mapped,
      source: 'shopify',
      collectionTitle,
      shopifyWarning: configWarning,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Shopify fetch failed';
    console.error('[Shopify] estore fetch failed:', msg);
    return { products: [], source: 'static', shopifyWarning: configWarning ?? msg };
  }
}

export async function getDivineStoreProductById(id: number): Promise<JgProduct | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const node = await fetchProductById(id);
    if (node) return mapShopifyToJgProduct(node);
  } catch (err) {
    console.error('[Shopify] product fetch failed:', err);
  }
  return null;
}

export async function getDivineStoreProductCatalog(): Promise<JgProduct[]> {
  const { products } = await getDivineStoreProducts();
  return products;
}

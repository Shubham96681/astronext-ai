/** Production-safe defaults when env vars are unset (e.g. Vercel without Shopify env). */
export const SHOPIFY_DEFAULTS = {
  storeDomain: 'www.astronext.ai',
  myshopifyDomain: '00mi0h-6k.myshopify.com',
  collectionId: 'gid://shopify/Collection/321156776094',
  collectionHandle: 'rudraksha-bracelets',
  apiVersion: '2024-01',
} as const;

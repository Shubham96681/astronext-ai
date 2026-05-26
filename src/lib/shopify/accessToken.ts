type TokenCache = {
  token: string;
  expiresAt: number;
};

let cached: TokenCache | null = null;

function shopMyshopifyHost(): string | null {
  const raw = process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim() || process.env.SHOPIFY_SHOP_DOMAIN?.trim();
  if (!raw) return null;
  const host = raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (host.includes('.myshopify.com')) return host;
  return null;
}

/** Exchange client_id + client_secret for a 24h Admin API token (Dev Dashboard apps on owned stores). */
export async function fetchClientCredentialsToken(): Promise<string | null> {
  const clientId = process.env.SHOPIFY_API_KEY?.trim();
  const clientSecret = process.env.SHOPIFY_API_SECRET?.trim();
  const host = shopMyshopifyHost();

  if (!clientId || !clientSecret || !host) return null;

  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(`https://${host}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    if (text.includes('app_not_installed')) {
      console.warn('[Shopify] App not installed on store — install the app or set SHOPIFY_ADMIN_ACCESS_TOKEN (shpat_…)');
    }
    return null;
  }

  const json = (await res.json()) as { access_token: string; expires_in?: number };
  const expiresIn = json.expires_in ?? 86_400;
  cached = {
    token: json.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return json.access_token;
}

export async function resolveAdminAccessToken(): Promise<string> {
  const envToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim() ?? '';
  if (envToken.startsWith('shpat_')) return envToken;

  const oauthToken = await fetchClientCredentialsToken();
  if (oauthToken) return oauthToken;

  return '';
}

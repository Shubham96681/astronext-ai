import fs from 'fs';

function loadEnvLocal() {
  const path = '.env.local';
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\u003c/g, '<')
    .replace(/\u003e/g, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function paragraphsFromHtml(html) {
  const text = stripHtml(html);
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function shortDesc(paragraphs, max = 200) {
  const first = paragraphs[0] ?? '';
  return first.length > max ? `${first.slice(0, max - 1)}…` : first;
}

function specsFromParagraphs(paragraphs) {
  const specs = [];
  const headings = [
    'WORKMANSHIP',
    'CARE INSTRUCTIONS',
    'WEAR AND PRAY',
    'BRACELET SIZES',
    'ORIGINAL RUDRAKSHA',
    'FITTING',
    'What is',
    'Why to use',
    'How to use',
    'Benefits',
    'Other important points',
    'Usage',
    'Uses',
    'Why To Use',
    'How To Use',
    'How to Charge it',
    'Who Should Wear',
    'Which Wrist',
    'Healing Properties',
  ];

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const upper = p.toUpperCase();
    const hit = headings.find((h) => upper.startsWith(h.toUpperCase()) || upper === h.toUpperCase());
    if (hit) {
      const body = paragraphs[i + 1] ?? '';
      if (body && !headings.some((h) => body.toUpperCase().startsWith(h.toUpperCase()))) {
        specs.push({ title: hit.replace(/:$/, ''), description: body });
      }
    }
  }

  if (specs.length === 0 && paragraphs.length > 1) {
    specs.push({
      title: 'Product details',
      description: paragraphs.slice(1, 4).join(' ').slice(0, 280),
    });
  }

  return specs.slice(0, 6);
}

function collectionIdNumeric() {
  const gid =
    process.env.SHOPIFY_COLLECTION_ID?.trim() || 'gid://shopify/Collection/321156776094';
  const match = gid.match(/(\d+)\s*$/);
  return match?.[1] ?? '321156776094';
}

async function loadShopifyProducts() {
  const rawPath = 'scripts/_shopify-raw.json';
  if (fs.existsSync(rawPath)) {
    return JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  }

  loadEnvLocal();
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  const domain =
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim() ||
    process.env.SHOPIFY_SHOP_DOMAIN?.trim() ||
    '00mi0h-6k.myshopify.com';
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || '2024-10';

  if (!token) {
    throw new Error(
      'Set SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local, or place a dump at scripts/_shopify-raw.json',
    );
  }

  const host = domain.includes('.myshopify.com') ? domain : `${domain}.myshopify.com`;
  const collectionId = collectionIdNumeric();
  const products = [];
  let url = `https://${host}/admin/api/${apiVersion}/products.json?limit=250&collection_id=${collectionId}`;

  while (url) {
    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': token, Accept: 'application/json' },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Shopify Admin API ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = await res.json();
    products.push(...(data.products ?? []));
    const link = res.headers.get('link');
    const next = link?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    url = next ?? null;
  }

  return { products };
}

const raw = await loadShopifyProducts();

const products = raw.products.map((p) => {
  const variant = p.variants[0];
  const price = Math.round(parseFloat(variant?.price ?? '0'));
  const compareRaw = variant?.compare_at_price ? Math.round(parseFloat(variant.compare_at_price)) : undefined;
  const compareAtPrice = compareRaw && compareRaw > price ? compareRaw : undefined;
  const images = (p.images ?? []).map((img) => img.src).filter(Boolean);
  const aboutParagraphs = paragraphsFromHtml(p.body_html ?? '');
  const category =
    (p.product_type && p.product_type.trim()) ||
    (p.vendor && p.vendor !== 'My Store' ? p.vendor : 'Divine Store');

  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    category,
    vendor: p.vendor || 'astronext.ai',
    price,
    compareAtPrice,
    desc: shortDesc(aboutParagraphs),
    descLong: aboutParagraphs.join('\n\n'),
    aboutParagraphs,
    rating: 4.9,
    reviews: 0,
    inStock: Boolean(variant?.available ?? true),
    images,
    image: images[0] ?? '',
    priceNote: 'Inclusive of blessings · Ships from Puri',
    trustBullets: [
      'Genuine sacred items from trusted sources',
      'Secure packaging for safe delivery',
      'Devotee-rated quality on Astronext Divine Store',
    ],
    specs: specsFromParagraphs(aboutParagraphs),
  };
});

const catalog = {
  version: 1,
  collectionTitle: 'rudraksha bracelets',
  collectionHandle: 'rudraksha-bracelets',
  updatedAt: new Date().toISOString().slice(0, 10),
  products,
};

fs.writeFileSync('src/data/divine-store-catalog.json', JSON.stringify(catalog, null, 2));
console.log('Wrote', products.length, 'products to src/data/divine-store-catalog.json');

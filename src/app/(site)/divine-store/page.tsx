import JagannathStorePage from '@/components/JagannathStorePage';
import { getDivineStoreProducts } from '@/lib/storeProducts';

/** Always fetch fresh products on Vercel (avoids cached empty builds). */
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { products, shopifyWarning } = await getDivineStoreProducts();
  return <JagannathStorePage products={products} shopifyWarning={shopifyWarning} />;
}

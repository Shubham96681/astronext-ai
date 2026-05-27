import HomePage from '@/components/HomePage';
import { getDivineStoreProducts } from '@/lib/storeProducts';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { products } = await getDivineStoreProducts();
  return <HomePage products={products} />;
}

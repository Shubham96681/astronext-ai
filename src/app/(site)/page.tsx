import HomePage from '@/components/HomePage';
import { getDivineStoreProducts } from '@/lib/storeProducts';

export const revalidate = 300;

export default async function Page() {
  const { products } = await getDivineStoreProducts();
  return <HomePage products={products} />;
}

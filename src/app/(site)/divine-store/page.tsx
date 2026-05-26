import JagannathStorePage from '@/components/JagannathStorePage';
import { getDivineStoreProducts } from '@/lib/storeProducts';

export const revalidate = 300;

export default async function Page() {
  const { products } = await getDivineStoreProducts();
  return <JagannathStorePage products={products} />;
}

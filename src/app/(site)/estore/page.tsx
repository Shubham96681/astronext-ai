import EstorePage from '@/components/EstorePage';
import { getEstoreProducts } from '@/lib/storeProducts';

export const revalidate = 300;

export default async function Page() {
  const { products } = await getEstoreProducts();
  return <EstorePage products={products} />;
}

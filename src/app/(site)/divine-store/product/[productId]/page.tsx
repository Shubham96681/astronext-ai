import JgProductDetailPage from '@/components/JgProductDetailPage';
import { getDivineStoreProductById, getDivineStoreProductCatalog } from '@/lib/storeProducts';
import { parseRouteId } from '@/routes/paths';

type Props = {
  params: Promise<{ productId: string }>;
};

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { productId: productIdParam } = await params;
  const productId = parseRouteId(productIdParam);
  const [product, catalog] = await Promise.all([
    productId ? getDivineStoreProductById(productId) : Promise.resolve(null),
    getDivineStoreProductCatalog(),
  ]);

  return (
    <JgProductDetailPage
      product={product}
      catalog={catalog}
    />
  );
}

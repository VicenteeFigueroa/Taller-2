import { ProductDetailPage } from "@/views/productsPage/ProductDetailPage";

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDetailPage productId={params.id} />;
}

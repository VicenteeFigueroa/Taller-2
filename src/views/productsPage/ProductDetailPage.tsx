"use client";

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const product = {
    id: productId,
    name: "Teclado mecánico RGB",
    price: "$49.990",
    description:
      "Teclado mecánico con retroiluminación RGB, ideal para gaming y productividad. Switches tipo blue y estructura resistente.",
  };

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-50 flex flex-col md:flex-row gap-8">
        {/* Imagen (simulada) */}
        <div className="md:w-1/2 w-full">
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Imagen del producto
          </div>
        </div>

        {/* Info del producto */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-800 mb-2">{product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button className="w-full md:w-1/2 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
            Agregar al carrito
          </button>
        </div>
      </div>
    </>
  );
};

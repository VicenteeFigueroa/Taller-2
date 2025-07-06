"use client";

import { Navbar } from "@/components/Navbar";
import { CartButton } from "@/components/CartButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: productId,
    name: "Teclado mecánico RGB",
    price: 49990,
    priceFormatted: "$49.990",
    description:
      "Teclado mecánico con retroiluminación RGB, ideal para gaming y productividad. Switches tipo blue y estructura resistente.",
    stock: 15,
    category: "Periféricos",
    brand: "TechGaming",
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb y navegación */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <span>{product.category}</span>
              <span className="mx-2">/</span>
              <span>{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Imagen del producto */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Imagen del producto
              </div>
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                  Por <span className="font-medium">{product.brand}</span> •
                  Categoría: {product.category}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {product.priceFormatted}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock disponible: {product.stock} unidades
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Controles de cantidad y botones */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <span>-</span>
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      <span>+</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CartButton
                    productId={productId}
                    quantity={quantity}
                    size="lg"
                    className="flex-1"
                  />
                  <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Información adicional */}
              <div className="border-t pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Envío:</span> Gratis a todo
                    Chile
                  </div>
                  <div>
                    <span className="font-medium">Garantía:</span> 12 meses
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

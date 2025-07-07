"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProductById } from "@/services/products";
import { Product } from "@/interfaces/Product";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addCompleteProductToCart } = useCartOperations();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!product) return;

    // Verificar si el usuario está autenticado
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      const result = await addCompleteProductToCart(product, quantity);

      if (result.success) {
        toast.success(
          `${quantity} ${product.name} agregado${quantity > 1 ? "s" : ""} al carrito`,
        );
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Error al agregar producto al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await getProductById(productId);

        if (productData) {
          setProduct(productData);
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar el producto");
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Producto no encontrado"}
          </h2>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb y navegación */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al menú
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <p>Imagen no disponible</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Galería de miniaturas o carrusel */}
              {product.images && product.images.length > 1 && (
                <div className="space-y-2">
                  {product.images.length <= 4 ? (
                    // Cuadrícula para pocas imágenes
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className={`aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Carrusel horizontal para muchas imágenes
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Indicadores de navegación para imagen única con carrusel */}
                  {product.images.length === 1 && (
                    <div className="flex justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ Stock disponible: {product.stock} unidades
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        ✗ Sin stock
                      </span>
                    )}
                  </div>
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
                {product.stock > 0 && (
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
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock === 0}
                    size="lg"
                    className="flex-1"
                    variant={product.stock === 0 ? "secondary" : "default"}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isAdding
                      ? "Agregando..."
                      : product.stock === 0
                        ? "Sin stock disponible"
                        : "Agregar al carrito"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

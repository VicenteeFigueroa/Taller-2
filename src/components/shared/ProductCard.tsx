"use client";

import { Product } from "@/interfaces/Product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart/CartContext";
import { useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("Producto sin stock", {
        description: "Este producto no tiene stock disponible",
        duration: 3000,
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      // Agregar al carrito local con toda la información del producto
      addToCart(product.id.toString(), 1, {
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        stock: product.stock,
      });

      toast.success("Producto agregado al carrito", {
        description: `${product.name} se agregó correctamente`,
        duration: 3000,
      });
    } catch {
      toast.error("Error al agregar producto", {
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        duration: 4000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col">
      <div className="aspect-square bg-gray-100 rounded mb-3 relative overflow-hidden">
        <Image
          src={product.images?.[0] ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-sm font-semibold mb-1">{product.name}</h2>
      <p className="text-sm text-muted-foreground mb-2">
        $ {product.price.toLocaleString("es-CL")}
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Stock: {product.stock} disponibles
      </p>

      <div className="mt-auto space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock <= 0}
          size="sm"
          variant="default"
          className="w-full"
        >
          {isAddingToCart ? (
            <>
              <Plus className="w-4 h-4 mr-2 animate-spin" />
              Agregando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
            </>
          )}
        </Button>

        <Link href={`/products/${product.id}`} className="w-full">
          <Button size="sm" variant="outline" className="w-full">
            Ver más
          </Button>
        </Link>
      </div>
    </div>
  );
}

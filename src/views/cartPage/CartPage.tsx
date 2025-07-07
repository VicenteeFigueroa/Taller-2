"use client";

import { Button } from "@/components/ui/button";
import { CartItemList } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/contexts/cart/CartContext";
import { useCartOperations } from "@/hooks/useCartOperations";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const CartPage = () => {
  const { state, getTotalItems } = useCart();
  const { loadCartFromServer, isLoading } = useCartOperations();

  const totalItems = getTotalItems();

  // Cargar carrito desde servidor al montar el componente
  useEffect(() => {
    loadCartFromServer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Mi Carrito
              {totalItems > 0 && (
                <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? "producto" : "productos"}
                </span>
              )}
            </h1>
          </div>

          <p className="text-gray-600">
            {totalItems > 0
              ? "Revisa y confirma tu compra"
              : "Tu carrito está vacío"}
          </p>
        </div>

        {/* Contenido Principal */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando carrito...</p>
          </div>
        ) : state.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Productos en tu carrito
                </h2>
                <CartItemList items={state.items} />
              </div>
            </div>

            {/* Resumen del carrito */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Descubre nuestros productos y encuentra exactamente lo que
            necesitas.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Explorar productos
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

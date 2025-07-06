"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart/CartContext";
import { useCartOperations } from "@/hooks/useCartOperations";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartSummaryProps {
  showActions?: boolean;
  className?: string;
}

export const CartSummary = ({ 
  showActions = true, 
  className = "" 
}: CartSummaryProps) => {
  const { state, getTotalItems, getTotalPrice } = useCart();
  const { clearAllCart, isLoading } = useCartOperations();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleClearCart = async () => {
    if (confirm("¿Estás seguro de que quieres limpiar el carrito?")) {
      await clearAllCart();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Resumen del Carrito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total de productos:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="font-medium">${totalPrice.toLocaleString()}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {showActions && state.items.length > 0 && (
          <div className="space-y-2 pt-4">
            <Button 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              Proceder al Checkout
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearCart}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar carrito
            </Button>
          </div>
        )}
        
        {state.items.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Tu carrito está vacío</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CartBadgeProps {
  className?: string;
}

export const CartBadge = ({ className = "" }: CartBadgeProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <span className={`bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center ${className}`}>
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
};

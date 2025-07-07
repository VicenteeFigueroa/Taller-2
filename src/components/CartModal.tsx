"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CartItemList } from "./CartItem";
import { useCart } from "@/contexts/cart/CartContext";
import { useCartOperations } from "@/hooks/useCartOperations";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartModal = ({ open, onOpenChange }: CartModalProps) => {
  const { state, getTotalItems, getTotalPrice } = useCart();
  const { clearAllCart, isLoading } = useCartOperations();

  const handleClearCart = async () => {
    await clearAllCart();
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Button onClick={() => onOpenChange(false)}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <CartItemList items={state.items} />
          )}
        </div>

        {state.items.length > 0 && (
          <DialogFooter className="flex-col gap-4 sm:flex-col">
            <div className="flex justify-between items-center w-full text-lg font-semibold border-t pt-4">
              <span>Total:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isLoading}
                className="flex-1"
              >
                Limpiar carrito
              </Button>
              
              <Link href="/cart" className="flex-1">
                <Button 
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Ver carrito completo
                </Button>
              </Link>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export const CartIcon = ({ onClick, className = "" }: CartIconProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`relative ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
};

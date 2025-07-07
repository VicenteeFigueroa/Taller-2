"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/interfaces/Cart";
import { useCartOperations } from "@/hooks/useCartOperations";
import Image from "next/image";

interface CartItemComponentProps {
  item: CartItem;
  showControls?: boolean;
  className?: string;
}

export const CartItemComponent = ({ 
  item, 
  showControls = true, 
  className = "" 
}: CartItemComponentProps) => {
  const { updateProductQuantity, removeProductFromCart, isLoading } = useCartOperations();

  const handleUpdateQuantity = async (newQuantity: number) => {
    await updateProductQuantity(item.productId, newQuantity);
  };

  const handleRemoveItem = async () => {
    await removeProductFromCart(item.productId);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-lg ${className}`}>
      {/* Imagen del producto */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600">
          ${item.price.toLocaleString()} c/u
        </p>
        <p className="text-sm font-medium text-gray-900">
          Subtotal: ${subtotal.toLocaleString()}
        </p>
      </div>

      {/* Controles de cantidad */}
      {showControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isLoading || item.quantity <= 1}
            className="h-8 w-8"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="font-medium min-w-[2rem] text-center">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isLoading || item.quantity >= item.maxStock}
            className="h-8 w-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Botón eliminar */}
      {showControls && (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleRemoveItem}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

interface CartItemListProps {
  items: CartItem[];
  className?: string;
}

export const CartItemList = ({ items, className = "" }: CartItemListProps) => {
  if (items.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <CartItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};

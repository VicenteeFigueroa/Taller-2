"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useState } from "react";

interface CartButtonProps {
  productId: string;
  quantity?: number;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CartButton = ({
  productId,
  quantity = 1,
  variant = "default",
  size = "default",
  showIcon = true,
  disabled = false,
  className = "",
}: CartButtonProps) => {
  const { addProductToCart, isLoading } = useCartOperations();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const result = await addProductToCart(productId, quantity);
      
      if (result.success) {
        // Aquí podrías agregar un toast de éxito
        console.log("Producto agregado exitosamente");
      } else {
        // Aquí podrías agregar un toast de error
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const buttonDisabled = disabled || isLoading || isAdding;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={buttonDisabled}
      variant={variant}
      size={size}
      className={className}
    >
      {showIcon && <Plus className="mr-2 h-4 w-4" />}
      {isAdding ? "Agregando..." : "Agregar al carrito"}
    </Button>
  );
};

interface CartIconButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
}

export const CartIconButton = ({ 
  productId, 
  quantity = 1, 
  className = "" 
}: CartIconButtonProps) => {
  const { addProductToCart, isLoading } = useCartOperations();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const result = await addProductToCart(productId, quantity);
      
      if (result.success) {
        console.log("Producto agregado exitosamente");
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isAdding}
      variant="outline"
      size="icon"
      className={className}
    >
      <ShoppingCart className="h-4 w-4" />
    </Button>
  );
};

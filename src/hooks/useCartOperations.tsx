"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { CartService } from "@/clients/cartService";
import { CartItem } from "@/interfaces/Cart";

export const useCartOperations = () => {
  const { state, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Agrega un producto al carrito con validación de stock
   */
  const addProductToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validar stock disponible
      const validation = await CartService.validateAddToCart(productId, quantity);
      
      if (!validation.canAdd) {
        setError(validation.message);
        return { success: false, message: validation.message };
      }

      // Obtener detalles del producto
      const product = await CartService.getProductDetails(productId);

      // Agregar al carrito local
      addToCart(productId, quantity);

      // Sincronizar con el servidor
      await CartService.addToCart({ productId, quantity });

      return { 
        success: true, 
        message: "Producto agregado al carrito",
        product 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al agregar producto";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  const updateProductQuantity = async (productId: string, newQuantity: number) => {
    try {
      setIsLoading(true);
      setError(null);

      if (newQuantity <= 0) {
        return await removeProductFromCart(productId);
      }

      // Validar stock disponible
      const validation = await CartService.validateAddToCart(productId, newQuantity);
      
      if (!validation.canAdd) {
        setError(validation.message);
        return { success: false, message: validation.message };
      }

      // Actualizar en el carrito local
      updateQuantity(productId, newQuantity);

      // Sincronizar con el servidor
      await CartService.updateCartItem({ productId, quantity: newQuantity });

      return { 
        success: true, 
        message: "Cantidad actualizada" 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar cantidad";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina un producto del carrito
   */
  const removeProductFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Eliminar del carrito local
      removeFromCart(productId);

      // Sincronizar con el servidor
      await CartService.removeFromCart({ productId });

      return { 
        success: true, 
        message: "Producto eliminado del carrito" 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar producto";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpia todo el carrito
   */
  const clearAllCart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Limpiar carrito local
      clearCart();

      // Sincronizar con el servidor
      await CartService.clearCart();

      return { 
        success: true, 
        message: "Carrito limpiado" 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al limpiar carrito";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga el carrito desde el servidor
   */
  const loadCartFromServer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cartResponse = await CartService.getCart();
      
      if (cartResponse.success && cartResponse.data.cart) {
        // Aquí podrías usar un dispatch para cargar el carrito completo
        // Por ahora, este método está preparado para futuras expansiones
      }

      return { 
        success: true, 
        cart: cartResponse.data.cart 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar carrito";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado del carrito
    cartState: state,
    isLoading,
    error,
    
    // Operaciones
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearAllCart,
    loadCartFromServer,
    
    // Utilidades
    clearError: () => setError(null),
  };
};

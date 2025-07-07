"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { CartService } from "@/clients/cartService";
import { Product } from "@/interfaces/Product";

export const useCartOperations = () => {
  const { state, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();
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
      const validation = await CartService.validateAddToCart(
        productId,
        quantity,
      );

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
        product,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al agregar producto";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  const updateProductQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (newQuantity <= 0) {
        return await removeProductFromCart(productId);
      }

      // Validar stock disponible
      const validation = await CartService.validateAddToCart(
        productId,
        newQuantity,
      );

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
        message: "Cantidad actualizada",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar cantidad";
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
        message: "Producto eliminado del carrito",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar producto";
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
        message: "Carrito limpiado",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al limpiar carrito";
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
        cart: cartResponse.data.cart,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar carrito";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Versión simplificada para agregar productos al carrito sin validación del backend
   */
  const addProductToCartSimple = async (
    productId: string,
    quantity: number = 1,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Agregar al carrito local directamente
      addToCart(productId, quantity);

      // Intentar sincronizar con el servidor, pero no fallar si no funciona
      try {
        await CartService.addToCart({ productId, quantity });
        console.log("Producto sincronizado con el servidor");
      } catch (syncError) {
        // Si falla la sincronización, solo mostramos un warning pero no revertimos
        console.warn(
          "No se pudo sincronizar con el servidor, funcionando en modo offline:",
          syncError,
        );
      }

      return {
        success: true,
        message: "Producto agregado al carrito",
      };
    } catch (error) {
      // Si hay un error crítico, intentamos al menos mantener el carrito local
      console.error("Error al agregar al carrito:", error);

      try {
        // Intentar agregar solo al carrito local como último recurso
        addToCart(productId, quantity);
        return {
          success: true,
          message: "Producto agregado al carrito (modo offline)",
        };
      } catch (localError) {
        const errorMessage =
          localError instanceof Error
            ? localError.message
            : "Error al agregar producto";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Versión simplificada para actualizar cantidad sin validación del backend
   */
  const updateProductQuantitySimple = async (
    productId: string,
    newQuantity: number,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (newQuantity <= 0) {
        return await removeProductFromCartSimple(productId);
      }

      // Actualizar en el carrito local directamente
      updateQuantity(productId, newQuantity);

      // Intentar sincronizar con el servidor, pero no fallar si no funciona
      try {
        await CartService.updateCartItem({ productId, quantity: newQuantity });
        console.log("Cantidad sincronizada con el servidor");
      } catch (syncError) {
        console.warn(
          "No se pudo sincronizar cantidad con el servidor:",
          syncError,
        );
      }

      return {
        success: true,
        message: "Cantidad actualizada",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar cantidad";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Versión simplificada para eliminar productos del carrito
   */
  const removeProductFromCartSimple = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Eliminar del carrito local
      removeFromCart(productId);

      // Intentar sincronizar con el servidor
      try {
        await CartService.removeFromCart({ productId });
        console.log("Producto eliminado del servidor");
      } catch (syncError) {
        console.warn(
          "No se pudo sincronizar eliminación con el servidor:",
          syncError,
        );
      }

      return {
        success: true,
        message: "Producto eliminado del carrito",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar producto";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Versión simplificada para limpiar el carrito
   */
  const clearAllCartSimple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Limpiar carrito local
      clearCart();

      // Intentar sincronizar con el servidor
      try {
        await CartService.clearCart();
        console.log("Carrito limpiado en el servidor");
      } catch (syncError) {
        console.warn(
          "No se pudo sincronizar limpieza con el servidor:",
          syncError,
        );
      }

      return {
        success: true,
        message: "Carrito limpiado",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al limpiar carrito";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agrega un producto al carrito usando información completa del producto
   */
  const addCompleteProductToCart = async (
    product: Product,
    quantity: number = 1,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validar stock disponible
      if (quantity > product.stock) {
        const errorMessage = `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`;
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }

      // Agregar al carrito local con información completa
      addToCart(product.id.toString(), quantity, product);

      return {
        success: true,
        message: "Producto agregado al carrito",
        product,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al agregar producto";
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
    addProductToCartSimple,
    updateProductQuantity,
    updateProductQuantitySimple,
    removeProductFromCart,
    removeProductFromCartSimple,
    clearAllCart,
    clearAllCartSimple,
    loadCartFromServer,
    addCompleteProductToCart,

    // Utilidades
    clearError: () => setError(null),
  };
};

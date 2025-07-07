"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { CartState, cartReducer } from "./CartReducer";
import { CartItem } from "@/interfaces/Cart";

interface CartContextType {
  state: CartState;
  addToCart: (
    productId: string,
    quantity?: number,
    productInfo?: {
      name: string;
      price: number;
      image?: string;
      stock: number;
    },
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (
    productId: string,
    quantity: number = 1,
    productInfo?: {
      name: string;
      price: number;
      image?: string;
      stock: number;
    },
  ) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId, quantity, productInfo },
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { productId },
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = (): number => {
    return state.items.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0,
    );
  };

  const getTotalPrice = (): number => {
    return state.items.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0,
    );
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

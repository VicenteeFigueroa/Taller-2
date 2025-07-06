"use client";

import { CartItem, CartState as ICartState } from "@/interfaces/Cart";

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_CART_SUCCESS"; payload: CartItem[] };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // Si no existe, necesitamos crear un nuevo item
      // En una implementación real, aquí harías una llamada a la API para obtener los datos del producto
      const newItem: CartItem = {
        id: Date.now().toString(), // ID temporal
        productId,
        name: `Producto ${productId}`, // Placeholder
        price: 0, // Se debe obtener de la API
        quantity,
        maxStock: 100, // Se debe obtener de la API
        image: "", // Se debe obtener de la API
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_FROM_CART": {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.productId !== productId),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }

    case "LOAD_CART_SUCCESS": {
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
      };
    }

    default:
      return state;
  }
};

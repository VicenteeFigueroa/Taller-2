import { ApiBackend } from "./axios";
import { 
  CartItem, 
  AddToCartRequest, 
  UpdateCartItemRequest, 
  RemoveFromCartRequest 
} from "@/interfaces/Cart";
import { Product } from "@/interfaces/Product";
import { ResponseAPI } from "@/interfaces/ResponseAPI";

export interface CartResponse extends ResponseAPI {
  data: {
    cart: CartItem[];
    totalItems: number;
    totalAmount: number;
  };
}

export interface ProductStockResponse extends ResponseAPI {
  data: {
    productId: string;
    stock: number;
    isAvailable: boolean;
  };
}

export interface AddToCartResponse extends ResponseAPI {
  data: {
    cartItem: CartItem;
    message: string;
  };
}

export class CartService {
  /**
   * Obtiene el carrito actual del usuario
   */
  static async getCart(): Promise<CartResponse> {
    try {
      const response = await ApiBackend.get<CartResponse>("/cart");
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  /**
   * Agrega un producto al carrito
   */
  static async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    try {
      const response = await ApiBackend.post<AddToCartResponse>("/cart/add", request);
      return response.data;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito");
    }
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  static async updateCartItem(request: UpdateCartItemRequest): Promise<AddToCartResponse> {
    try {
      const response = await ApiBackend.put<AddToCartResponse>(
        `/cart/update/${request.productId}`, 
        { quantity: request.quantity }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al actualizar cantidad del producto");
    }
  }

  /**
   * Elimina un producto del carrito
   */
  static async removeFromCart(request: RemoveFromCartRequest): Promise<ResponseAPI> {
    try {
      const response = await ApiBackend.delete<ResponseAPI>(`/cart/remove/${request.productId}`);
      return response.data;
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  /**
   * Limpia todo el carrito
   */
  static async clearCart(): Promise<ResponseAPI> {
    try {
      const response = await ApiBackend.delete<ResponseAPI>("/cart/clear");
      return response.data;
    } catch (error) {
      throw new Error("Error al limpiar el carrito");
    }
  }

  /**
   * Verifica el stock disponible de un producto
   */
  static async checkProductStock(productId: string): Promise<ProductStockResponse> {
    try {
      const response = await ApiBackend.get<ProductStockResponse>(`/products/${productId}/stock`);
      return response.data;
    } catch (error) {
      throw new Error("Error al verificar stock del producto");
    }
  }

  /**
   * Obtiene los detalles de un producto para el carrito
   */
  static async getProductDetails(productId: string): Promise<Product> {
    try {
      const response = await ApiBackend.get<ResponseAPI>(`/products/${productId}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Error al obtener detalles del producto");
    }
  }

  /**
   * Valida si se puede agregar una cantidad específica al carrito
   */
  static async validateAddToCart(productId: string, quantity: number): Promise<{
    canAdd: boolean;
    availableStock: number;
    message: string;
  }> {
    try {
      const stockResponse = await this.checkProductStock(productId);
      const availableStock = stockResponse.data.stock;
      
      if (!stockResponse.data.isAvailable) {
        return {
          canAdd: false,
          availableStock: 0,
          message: "Producto no disponible"
        };
      }

      if (quantity > availableStock) {
        return {
          canAdd: false,
          availableStock,
          message: `Stock insuficiente. Disponible: ${availableStock}`
        };
      }

      return {
        canAdd: true,
        availableStock,
        message: "Producto disponible"
      };
    } catch (error) {
      return {
        canAdd: false,
        availableStock: 0,
        message: "Error al validar disponibilidad"
      };
    }
  }

  /**
   * Sincroniza el carrito local con el servidor
   */
  static async syncCart(localCart: CartItem[]): Promise<CartResponse> {
    try {
      const response = await ApiBackend.post<CartResponse>("/cart/sync", {
        items: localCart
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al sincronizar carrito");
    }
  }
}

export default CartService;

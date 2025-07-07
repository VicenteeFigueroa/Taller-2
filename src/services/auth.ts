import { ApiBackend } from "@/clients/axios";

export interface RegisterRequest {
  firtsName: string; // Nota: mantiene el typo del backend
  lastName: string;
  email: string;
  thelephone: string; // Nota: mantiene el typo del backend
  password: string;
  confirmPassword: string;
  birthDate?: string; // Opcional
  street?: string; // Opcional
  number?: string; // Opcional
  commune?: string; // Opcional
  region?: string; // Opcional
  postalCode?: string; // Opcional
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    firtsName: string;
    lastName: string;
    email: string;
    thelephone: string;
    birthDate?: string;
    registeredAt: string;
    isActive: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    firtsName: string;
    lastName: string;
    email: string;
    thelephone: string;
    birthDate?: string;
    registeredAt: string;
    isActive: boolean;
  };
}

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log(
        "Enviando petición de registro a:",
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      );
      console.log("Datos enviados:", data);

      const response = await ApiBackend.post("/auth/register", data);

      console.log("Respuesta recibida:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("Error en authService.register:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error ${error.response.status}: ${error.response.statusText}`;

        throw new Error(message);
      } else if (error.request) {
        console.error("Error request:", error.request);
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que el backend esté funcionando.",
        );
      } else {
        console.error("Error message:", error.message);
        throw new Error(
          error.message || "Error desconocido al registrar usuario",
        );
      }
    }
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await ApiBackend.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión",
      );
    }
  },

  async logout(): Promise<void> {
    try {
      await ApiBackend.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await ApiBackend.get("/auth/verify");
      return response.data.success;
    } catch {
      localStorage.removeItem("token");
      return false;
    }
  },
};

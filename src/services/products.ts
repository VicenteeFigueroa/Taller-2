import { ApiBackend } from "@/clients/axios";
import { Product } from "@/interfaces/Product";

export interface FetchParams {
  search?: string;
  categories?: string[]; // antes era category: string
  brands?: string[]; // antes era brand: string
  condition?: string;
  orderBy?: string;
  pageNumber?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(params: FetchParams): Promise<Product[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.append("search", params.search);
  }
  // ✅ Serializar arrays como 'A,B,C'
  if (params.categories && params.categories.length > 0) {
    query.append("categories", params.categories.join(","));
  }

  if (params.brands && params.brands.length > 0) {
    query.append("brands", params.brands.join(","));
  }

  if (params.condition && params.condition !== "all") {
    query.append("status", params.condition); // Si backend espera `status=new/used`
  }

  if (params.minPrice != null) {
    query.append("minPrice", String(params.minPrice));
  }

  if (params.maxPrice != null) {
    query.append("maxPrice", String(params.maxPrice));
  }

  if (params.orderBy) {
    query.append("orderBy", params.orderBy);
  }

  query.append("pageNumber", String(params.pageNumber ?? 1));
  query.append("pageSize", String(params.pageSize ?? 8));

  const res = await ApiBackend.get(`/product?${query.toString()}`);
  return res.data.data || []; // Asegúrate que res.data.data sea correcto según tu API
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await ApiBackend.get(`/product/${id}`);
    return res.data.data || null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
}

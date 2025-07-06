export interface Product {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  status?: 'new' | 'used' | 'available' | 'unavailable';
  image?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

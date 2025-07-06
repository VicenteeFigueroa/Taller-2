export interface ProductFiltersForm {
  search?: string;
  orderBy?: string;
  condition?: number; // 0: todos, 1: nuevo, 2: usado
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  categories: string[];
}

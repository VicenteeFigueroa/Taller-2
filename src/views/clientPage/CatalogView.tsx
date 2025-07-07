"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "@/interfaces/Product";
import { ProductFiltersForm } from "@/interfaces/ProductFiltersForm";
import { getProducts } from "@/services/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [minPrice] = useState(0);
  const [maxPrice] = useState(48000);

  const form = useForm<ProductFiltersForm>({
    defaultValues: {
      search: "",
      orderBy: "default",
      condition: 0,
      minPrice: 0,
      maxPrice: 48000,
      brands: [],
      categories: [],
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const values = form.getValues();

      const params: any = {
        pageNumber: page,
        pageSize,
      };

      // 🔍 Búsqueda por nombre o descripción
      if (values.search?.trim()) {
        params.search = values.search.trim();
      }

      // ✅ Filtro por categorías
      if (values.categories && values.categories.length > 0) {
        params.categories = values.categories;
      }

      // ✅ Filtro por marcas
      if (values.brands && values.brands.length > 0) {
        params.brands = values.brands;
      }

      // ✅ Condición (mapear el número del form a texto)
      if (values.condition === 1) {
        params.condition = "new";
      } else if (values.condition === 2) {
        params.condition = "used";
      }

      console.log("Orden seleccionado:", values.orderBy);

      // ✅ Ordenamiento
      switch (values.orderBy) {
        case "name":
          params.orderBy = "name";
          break;
        case "name_desc":
          params.orderBy = "-name";
          break;
        case "price":
          params.orderBy = "price";
          break;
        case "price_desc":
          params.orderBy = "-price";
          break;
      }

      // ✅ Rango de precios (solo si cambian)
      if (values.minPrice !== minPrice) {
        params.minPrice = values.minPrice;
      }
      if (values.maxPrice !== maxPrice) {
        params.maxPrice = values.maxPrice;
      }

      console.log("Parámetros enviados:", params);

      const res = await getProducts(params);
      setProducts(res);

      // Opcional: actualizar filtros disponibles en base a respuesta
      const categories = [...new Set(res.map((p) => p.category))];
      const brands = [...new Set(res.map((p) => p.brand))];
      setAllCategories(categories);
      setAllBrands(brands);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
    setLoading(false);
  };

  const handleClear = () => {
    form.reset({
      search: "",
      orderBy: "default",
      condition: 0,
      minPrice: minPrice,
      maxPrice: maxPrice,
      brands: [],
      categories: [],
    });
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Catálogo
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Encuentra los mejores productos al mejor precio
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR DE FILTROS */}
        <aside className="w-full lg:w-1/4 border rounded-md p-4 shadow-sm bg-white">
          <ProductFilters
            form={form}
            onSubmit={() => {
              setPage(1);
              fetchProducts();
            }}
            onSearchSubmit={() => {
              setPage(1);
              fetchProducts();
            }}
            onClear={handleClear}
            availableBrands={allBrands}
            availableCategories={allCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>

        {/* LISTADO DE PRODUCTOS */}
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-64 rounded-md" />
                ))
              : products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* PAGINACIÓN */}
          <div className="flex justify-center mt-6 space-x-2">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="flex items-center px-4">Página {page}</span>
            <Button
              disabled={products.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>
    </div>
  );
}

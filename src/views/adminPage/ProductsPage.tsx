"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/LoginModal";
import { ApiBackend } from "@/clients/axios";

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  condition: number; // 0: nuevo, 1: usado
}

export default function ProductsPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    brand: "all",
    condition: "all",
    minPrice: "",
    maxPrice: "",
  });

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userRaw);
    if (user.role !== "Admin") {
      router.push("/");
      return;
    }

    fetchProducts();
  }, [pageNumber, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.category !== "all")
        params.append("categories", filters.category);
      if (filters.brand !== "all") params.append("brands", filters.brand);
      if (filters.condition !== "all")
        params.append("condition", filters.condition);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());

      const response = await ApiBackend.get(`/product?${params.toString()}`);

      if (response.data.success) {
        const data: Product[] = response.data.data;
        setProducts(data);

        const uniqueCategories = Array.from(
          new Set(data.map((p) => p.category)),
        ).sort();
        const uniqueBrands = Array.from(
          new Set(data.map((p) => p.brand)),
        ).sort();
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      } else {
        setProducts([]);
        setCategories([]);
        setBrands([]);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProducts([]);
      setCategories([]);
      setBrands([]);
    }

    setLoading(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPageNumber(1);
  };

  const renderCondition = (condition: number) => {
    if (condition === 0) return <Badge variant="default">Nuevo</Badge>;
    if (condition === 1) return <Badge variant="outline">Usado</Badge>;
    return <Badge variant="secondary">Desconocido</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Gestión de Productos
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        {/* FILTROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre o descripción"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            value={filters.category}
            onValueChange={(v) => handleFilterChange("category", v)}
          >
            <SelectTrigger>
              <SelectValue>
                {filters.category === "all"
                  ? "Todas las categorías"
                  : filters.category}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.brand}
            onValueChange={(v) => handleFilterChange("brand", v)}
          >
            <SelectTrigger>
              <SelectValue>
                {filters.brand === "all" ? "Todas las marcas" : filters.brand}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.condition}
            onValueChange={(v) => handleFilterChange("condition", v)}
          >
            <SelectTrigger>
              <SelectValue>
                {filters.condition === "all"
                  ? "Todos los estados"
                  : filters.condition === "0"
                    ? "Nuevo"
                    : "Usado"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="0">Nuevo</SelectItem>
              <SelectItem value="1">Usado</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Precio mínimo"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Precio máximo"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.brand}</TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    <TableCell>{renderCondition(p.condition)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">Página {pageNumber}</span>
          <Button
            disabled={products.length < pageSize}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </main>

      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}

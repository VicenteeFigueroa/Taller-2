"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VirtualizedList } from "@/components/ui/virtualized-list";

import { Filter, Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { ProductFiltersForm } from "@/interfaces/ProductFiltersForm";

const sortBy = [
  { value: "default", label: "Sin orden" },
  { value: "name", label: "Nombre A-Z" },
  { value: "name_desc", label: "Nombre Z-A" },
  { value: "price", label: "Precio menor a mayor" },
  { value: "price_desc", label: "Precio mayor a menor" },
  { value: "newest", label: "Más recientes" },
];

const conditionOptions = [
  { value: 0, label: "Todos" },
  { value: 1, label: "Nuevo" },
  { value: 2, label: "Usado" },
];

interface ProductFiltersProps {
  form: ReturnType<typeof useFormContext<ProductFiltersForm>>;
  onSubmit: () => void;
  onSearchSubmit: () => void;
  onClear: () => void;
  availableBrands: string[];
  availableCategories: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const ProductFilters = ({
  form,
  onSubmit,
  onSearchSubmit,
  onClear,
  availableBrands = [],
  availableCategories = [],
  minPrice = 0,
  maxPrice = 10000,
}: ProductFiltersProps) => {
  const roundedMinPrice = Math.floor(minPrice / 1000) * 1000;
  const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;

  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    roundedMinPrice,
    roundedMaxPrice,
  ]);

  const selectedBrands = form.watch("brands") || [];
  const selectedCategories = form.watch("categories") || [];
  const currentMinPrice = form.watch("minPrice");
  const currentMaxPrice = form.watch("maxPrice");

  useEffect(() => {
    const min = currentMinPrice ?? roundedMinPrice;
    const max = currentMaxPrice ?? roundedMaxPrice;
    setPriceRange([min, max]);
  }, [currentMinPrice, currentMaxPrice, roundedMinPrice, roundedMaxPrice]);

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    form.setValue(
      "minPrice",
      newRange[0] === roundedMinPrice ? undefined : newRange[0],
    );
    form.setValue(
      "maxPrice",
      newRange[1] === roundedMaxPrice ? undefined : newRange[1],
    );
  };

  const handleToggle = (item: string, field: "brands" | "categories") => {
    const selected = form.watch(field) || [];
    const updated = selected.includes(item)
      ? selected.filter((v: string) => v !== item)
      : [...selected, item];
    form.setValue(field, updated);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <div className="bg-card rounded-lg border h-fit w-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por nombre o descripción</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar..."
              className="pl-10"
              onKeyDown={handleSearchKeyDown}
              {...form.register("search")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Controller
            name="orderBy"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
                  {sortBy.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-4">
          <Label>Rango de precios</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              min={roundedMinPrice}
              max={roundedMaxPrice}
              step={1}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>{formatPrice(roundedMinPrice)}</span>
              <span>{formatPrice(roundedMaxPrice)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded">
            <p>{formatPrice(currentMinPrice ?? roundedMinPrice)}</p>
            <p>{formatPrice(currentMaxPrice ?? roundedMaxPrice)}</p>
          </div>
        </div>

        {availableBrands.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setBrandExpanded(!brandExpanded)}
              className="w-full flex justify-between p-2 hover:bg-muted/50 rounded"
            >
              <Label>Marcas ({availableBrands.length})</Label>
              {brandExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {brandExpanded && (
              <div className="space-y-2">
                <Input
                  placeholder="Buscar marca..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                />
                <VirtualizedList
                  items={availableBrands}
                  searchTerm={brandSearch}
                  selectedItems={selectedBrands}
                  onToggleItem={(brand) => handleToggle(brand, "brands")}
                  idPrefix="brand"
                />
              </div>
            )}
          </div>
        )}

        {availableCategories.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setCategoryExpanded(!categoryExpanded)}
              className="w-full flex justify-between p-2 hover:bg-muted/50 rounded"
            >
              <Label>Categorías ({availableCategories.length})</Label>
              {categoryExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {categoryExpanded && (
              <div className="space-y-2">
                <Input
                  placeholder="Buscar categoría..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                <VirtualizedList
                  items={availableCategories}
                  searchTerm={categorySearch}
                  selectedItems={selectedCategories}
                  onToggleItem={(category) =>
                    handleToggle(category, "categories")
                  }
                  idPrefix="category"
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Label>Condición</Label>
          <Controller
            name="condition"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                {conditionOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`condition-${option.value}`}
                    />
                    <Label htmlFor={`condition-${option.value}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={onSubmit} className="flex-1">
            Aplicar filtros
          </Button>
          <Button onClick={onClear} variant="outline">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

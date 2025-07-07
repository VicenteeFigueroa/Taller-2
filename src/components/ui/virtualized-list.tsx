import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface VirtualizedListProps {
  items: string[];
  searchTerm: string;
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  idPrefix: string;
}

export const VirtualizedList = ({
  items,
  searchTerm,
  selectedItems,
  onToggleItem,
  idPrefix,
}: VirtualizedListProps) => {
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [items, searchTerm],
  );

  const renderedItems = useMemo(() => {
    return filteredItems.map((item) => (
      <div key={item} className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}-${item}`}
          checked={selectedItems.includes(item)}
          onCheckedChange={() => onToggleItem(item)}
          className="cursor-pointer"
        />
        <Label
          htmlFor={`${idPrefix}-${item}`}
          className="text-sm cursor-pointer flex-1"
        >
          {item}
        </Label>
      </div>
    ));
  }, [filteredItems, selectedItems, onToggleItem, idPrefix]);

  return (
    <div className="space-y-2">
      {searchTerm && (
        <p className="text-xs text-muted-foreground">
          {filteredItems.length} resultado
          {filteredItems.length !== 1 ? "s" : ""} encontrado
          {filteredItems.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="h-64 overflow-y-auto border rounded-md p-2 bg-muted/10 space-y-1">
        {filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No se encontraron elementos
          </p>
        ) : (
          <div className="space-y-1">{renderedItems}</div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {selectedItems.length > 0 &&
          `${selectedItems.length} seleccionado${selectedItems.length !== 1 ? "s" : ""} • `}
        Total: {filteredItems.length} elemento
        {filteredItems.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

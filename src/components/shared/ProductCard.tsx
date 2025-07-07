import { Product } from "@/interfaces/Product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col">
      <div className="aspect-square bg-gray-100 rounded mb-3 relative overflow-hidden">
        <Image
          src={product.images?.[0] ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-sm font-semibold mb-1">{product.name}</h2>
      <p className="text-sm text-muted-foreground mb-2">
        $ {product.price.toLocaleString("es-CL")}
      </p>
      <Link href={`/products/${product.id}`} className="mt-auto">
        <Button size="sm" className="w-full">
          Ver más
        </Button>
      </Link>
    </div>
  );
}

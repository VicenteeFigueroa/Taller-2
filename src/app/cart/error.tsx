"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error en el carrito
          </h1>
          <p className="text-gray-600">
            Ha ocurrido un error al cargar tu carrito de compras.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Si el problema persiste, contacta con nuestro{" "}
            <span className="text-primary cursor-pointer hover:underline">
              soporte técnico
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

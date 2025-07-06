"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { PlusCircle, ShoppingCart, Users } from "lucide-react";

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificación de token y rol
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userRaw);
    if (user.role !== "Admin") {
      router.push("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Panel de Administración
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Selecciona una opción
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Botón 1: Crear Producto */}
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/create-product")}
            className="h-full p-6 flex flex-col items-center border rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-accent/50 hover:scale-[1.02]"
          >
            <PlusCircle className="!w-16 !h-16 mb-4 text-primary" />
            <h2 className="font-semibold text-lg mb-2">Crear Producto</h2>
            <p className="text-sm text-muted-foreground">Ir a crear</p>
          </Button>

          {/* Botón 2: Gestión de Productos */}
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/products")}
            className="h-full p-6 flex flex-col items-center border rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-accent/50 hover:scale-[1.02]"
          >
            <ShoppingCart className="!w-16 !h-16 mb-4 text-primary" />
            <h2 className="font-semibold text-lg mb-2">Gestión de Productos</h2>
            <p className="text-sm text-muted-foreground">Ver productos</p>
          </Button>

          {/* Botón 3: Gestión de Usuarios */}
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="h-full p-6 flex flex-col items-center border rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-accent/50 hover:scale-[1.02]"
          >
            <Users className="!w-16 !h-16 mb-4 text-primary" />
            <h2 className="font-semibold text-lg mb-2">Gestión de Usuarios</h2>
            <p className="text-sm text-muted-foreground">Ver usuarios</p>
          </Button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>

      {/* MODAL LOGIN */}
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
import Image from "next/image";
//import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Productos destacados</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col"
            >
              <div className="aspect-square bg-gray-100 rounded mb-3 relative overflow-hidden">
                <Image
                  src="/producto-ejemplo.jpg"
                  alt="Producto"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h2 className="text-sm font-semibold mb-1">Producto {idx + 1}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                $ {(9990 + idx * 100).toLocaleString()}
              </p>
              <Link href={`/products/${idx + 1}`} className="mt-auto">
                <Button size="sm" className="w-full">
                  Ver más
                </Button>
              </Link>
            </div>
          ))}
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

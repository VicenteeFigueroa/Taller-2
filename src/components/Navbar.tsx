"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "@/components/LoginModal";
import { useAuth } from "@/contexts/auth/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CartModal, CartIcon } from "@/components/CartModal";

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada", {
      description: "Has cerrado sesión correctamente.",
    });
    router.push("/");
  };

  return (
    <>
      <header className="w-full shadow-sm bg-white dark:bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </Link>

          <Input
            placeholder="Buscar productos..."
            className="max-w-md flex-1"
          />

          <div className="flex gap-2">
            <CartIcon onClick={() => setShowCart(true)} />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{`${user.firstName} ${user.lastName}`}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/perfil")}>
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        open={showLogin}
        onOpenChange={setShowLogin}
        onSuccess={() => {
          setShowLogin(false);
          toast.success("¡Bienvenido de vuelta!", {
            description: "Has iniciado sesión correctamente.",
          });
        }}
      />
      <CartModal open={showCart} onOpenChange={setShowCart} />
    </>
  );
};

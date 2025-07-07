"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  const handleProfileRedirect = () => {
    if (user?.role === "Admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  return (
    <>
      <header className="w-full shadow-sm bg-white dark:bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4 flex-wrap">
          <Link
            href="/"
            className="text-2xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity"
          >
            Blackcat
          </Link>

          <div className="flex gap-2">
            <CartIcon onClick={() => setShowCart(true)} />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{`${user.firstName} ${user.lastName}`}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleProfileRedirect}>
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

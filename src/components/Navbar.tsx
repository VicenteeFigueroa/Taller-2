"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/LoginModal";

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);

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
            <Button variant="outline" onClick={() => setShowLogin(true)}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
};

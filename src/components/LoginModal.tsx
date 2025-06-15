// components/LoginModal.tsx
"use client";

import { LoginPage } from "@/views/loginPage/LoginPage";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 shadow-xl">
        <DialogTitle className="sr-only">Iniciar sesión</DialogTitle>
        <DialogDescription className="sr-only">
          Formulario para iniciar sesión en tu cuenta
        </DialogDescription>
        <LoginPage />
      </DialogContent>
    </Dialog>
  );
};

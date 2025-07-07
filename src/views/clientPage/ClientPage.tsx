"use client";

import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ClientPage() {
  //const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    email: "",
    telephone: "",
    birthDate: "",
  });

  useEffect(() => {
    // Simular datos de usuario
    const fakeUser = {
      firstName: "Juan",
      email: "juan@example.com",
      telephone: "+56 9 1234 5678",
      birthDate: "1990-05-15",
    };

    setForm({
      firstName: fakeUser.firstName,
      email: fakeUser.email,
      telephone: fakeUser.telephone,
      birthDate: fakeUser.birthDate,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Simulación de actualización exitosa
    toast.success("Perfil actualizado", {
      description: "Los datos han sido guardados exitosamente.",
    });

    // Si quieres simular error:
    // toast.error("Error al actualizar", { description: "Hubo un problema." });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h1>
        <p className="text-center text-muted-foreground mb-8">
          Actualiza tu información personal
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <Label htmlFor="telephone">Teléfono</Label>
            <Input
              id="telephone"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Guardar cambios
          </Button>
        </div>
      </main>

      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>
    </div>
  );
}

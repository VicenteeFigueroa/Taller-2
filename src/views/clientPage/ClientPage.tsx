"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth/AuthContext";
import { getProfile, updateProfile } from "@/clients/userService";

const profileSchema = z.object({
  firstName: z.string().nonempty("Nombre es requerido"),
  email: z.string().email("Correo inválido").nonempty("Correo es requerido"),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ClientPage() {
  const { token, updateUser } = useAuth();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      birthDate: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const profile = await getProfile(token);
        reset({
          firstName: profile.firtsName || "",
          email: profile.email || "",
          phone: profile.thelephone || "", // backend tiene mal escrito "thelephone"
          birthDate: profile.birthDate || "",
        });
      } catch (error) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        toast.error("Error al cargar el perfil");
      }
    };

    fetchProfile();
  }, [token, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!token) return;

    try {
      await updateProfile(token, {
        firtsName: data.firstName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
      });

      updateUser({ firstName: data.firstName });

      toast.success("Perfil actualizado", {
        description: "Los datos han sido guardados exitosamente.",
      });
    } catch (error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      toast.error("Error al actualizar", {
        description: "Hubo un problema al guardar los datos.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h1>
        <p className="text-center text-muted-foreground mb-8">
          Actualiza tu información personal
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input id="birthDate" type="date" {...register("birthDate")} />
            {errors.birthDate && (
              <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </main>

      <footer className="bg-muted py-6 mt-12 text-center text-sm text-muted-foreground">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>
    </div>
  );
}

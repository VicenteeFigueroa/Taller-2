"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth";

const formSchema = z
  .object({
    firtsName: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
      .max(100, { message: "El nombre no puede tener más de 100 caracteres." }),
    lastName: z
      .string()
      .min(3, { message: "El apellido debe tener al menos 3 caracteres." })
      .max(100, {
        message: "El apellido no puede tener más de 100 caracteres.",
      }),
    email: z.string().email("Correo inválido").min(1, "Correo es requerido."),
    thelephone: z.string().min(1, { message: "Teléfono es requerido." }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "La contraseña debe incluir mayúscula, minúscula, número y carácter especial.",
        },
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmar contraseña es requerido." }),
    birthDate: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    commune: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firtsName: "",
      lastName: "",
      email: "",
      thelephone: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      street: "",
      number: "",
      commune: "",
      region: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setFormError(null);

    try {
      console.log("Datos del formulario:", values);

      // Preparar datos para enviar (incluyendo confirmPassword para el backend)
      const registerData = {
        firtsName: values.firtsName,
        lastName: values.lastName,
        email: values.email,
        thelephone: values.thelephone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        birthDate: values.birthDate,
        street: values.street,
        number: values.number,
        commune: values.commune,
        region: values.region,
        postalCode: values.postalCode,
      };

      console.log("Datos a enviar:", registerData);

      const response = await authService.register(registerData);

      console.log("Respuesta:", response);

      if (response.success) {
        toast.success("¡Registro exitoso! Redirigiendo al login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        const errorMessage = response.message || "Error al registrar usuario";
        console.error("Error en respuesta:", errorMessage);
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error completo:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      let errorMessage = "Error al registrar usuario";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status) {
        errorMessage = `Error ${error.response.status}: ${error.response.statusText || "Error del servidor"}`;
      }

      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {" "}
        {/* Ajusta la altura si el navbar mide 4rem */}
        {/* Lado izquierdo */}
        <div className="md:w-1/2 w-full bg-blue-700 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Crea tu cuenta <br className="hidden md:block" />
          </h1>
          <p className="text-base md:text-lg text-justify max-w-md">lol.</p>
          <p className="mt-10 text-xs md:text-sm text-gray-200 text-center">
            © 2025 MiTienda. Todos los derechos reservados.
          </p>
        </div>
        {/* Lado derecho */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
              Registro de Usuario
            </h2>
            <p className="mb-4 text-sm text-gray-600 text-center md:text-left"></p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="firtsName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thelephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+56 912345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

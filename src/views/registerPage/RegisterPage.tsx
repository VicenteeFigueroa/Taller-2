"use client";

//import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Navbar } from "@/components/Navbar";

const formSchema = z
  .object({
    name: z.string().nonempty({ message: "Nombre es requerido." }),
    email: z.string().email("Correo inválido").nonempty("Correo es requerido."),
    phone: z
      .string()
      .min(9, { message: "Debe tener al menos 9 dígitos." })
      .nonempty({ message: "Teléfono es requerido." }),
    birthdate: z
      .string()
      .nonempty({ message: "Fecha de nacimiento es requerida." }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirmar contraseña es requerido." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formError = null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado:", values);
    // Por ahora no hacemos lógica funcional
  };

  return (
    <>
      <Navbar />

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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
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
                  name="phone"
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
                  name="birthdate"
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

                <Button type="submit" className="w-full">
                  Registrarse
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

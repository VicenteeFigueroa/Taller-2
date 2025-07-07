"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiBackend } from "@/clients/axios";
import { LoginResponse } from "@/interfaces/LoginResponse";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/auth/AuthContext";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Ingrese un correo electrónico válido." })
    .nonempty({ message: "Email es requerido." }),
  password: z.string().nonempty({ message: "Contraseña es requerida." }),
});

export const LoginPage = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setFormError(null);
      const response = await ApiBackend.post<LoginResponse>(
        "auth/login",
        values,
      );
      const token = response.data.data?.token;
      if (!token) {
        setFormError("No se recibió el token.");
        return;
      }

      const decoded: any = jwtDecode(token);
      const role = decoded?.role;
      const email = decoded?.email;
      const firstName = decoded?.given_name || response.data.data?.firtsName;
      const lastName = decoded?.family_name || response.data.data?.lastName;

      const user = { firstName, lastName, email, role };

      login(user, token);

      if (onSuccess) onSuccess();

      if (role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 401) {
          setFormError("Correo o contraseña incorrectos.");
        } else {
          setFormError(
            "Error inesperado al iniciar sesión. Intenta más tarde.",
          );
        }
      } else {
        setFormError("Error desconocido.");
      }
    }
  };

  return (
    <div className="w-full p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-center">Iniciar sesión</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Ingresa tus credenciales para continuar
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
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
            Iniciar sesión
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  );
};

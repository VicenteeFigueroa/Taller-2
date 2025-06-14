"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { ApiBackend } from "@/clients/axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { User } from "@/interfaces/User";


const formSchema = z.object({
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }).nonempty({
    message: "Email es requerido."
  }),

  password: z.string().nonempty({
    message: "Contraseña es requerida."
}),
})

export const LoginPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [formError, setFormError] = useState<string | null>(null);


    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            console.log("Valores enviados de formulario:", values);
            const data = await ApiBackend.post<any>('auth/login', values);
            // const user_: User = {
            //     email: data.email,
            //     lastName: data.lastName,
            //     firtsName: data.firtsName,
            //     token: data.token,
            // }
            console.log("Respuesta del servidor:", data);


        } catch (error: any) {
        console.error("Error al enviar el formulario:", error);

        if (error?.response?.status === 401) {
            setFormError("Correo o contraseña incorrectos.");
        } else {
            setFormError("Error inesperado al iniciar sesión. Intenta más tarde.");
        }
        }
        // Aquí puedes manejar la lógica de inicio de sesión
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">

            {/* Lado izquierdo */}
            <div className="md:w-1/2 w-full bg-blue-700 text-white flex flex-col justify-center items-center p-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Bienvenido a <br className="hidden md:block" /> Intro. al Desarrollo Web Móvil 👋
                </h1>
                <p className="text-base md:text-lg text-justify max-w-md">
                    Evita tareas repetitivas y gana tiempo con automatización.
                    Mejora tu productividad como desarrollador móvil.
                </p>
                <p className="mt-10 text-xs md:text-sm text-gray-200 text-center">
                    © 2025 WebMóvil. Todos los derechos reservados.
                </p>
            </div>

            {/* Lado derecho */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-white px-6 py-10">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">Ayudantía WebMóvil</h2>
                    <h3 className="text-lg md:text-xl font-medium mb-2 text-center md:text-left">
                        ¡Bienvenido de nuevo!
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 text-center md:text-left">
                        ¿No tienes cuenta?{' '}
                        <a href="#" className="text-blue-600 underline">
                            Crea una ahora
                        </a>, es gratis.
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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


                            <Button type="submit">Iniciar sesión</Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-sm text-center md:text-left">
                        ¿Olvidaste tu contraseña?{' '}
                        <a href="#" className="text-blue-600 underline">
                            Haz clic aquí
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("Ingresá un email válido."),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 caracteres."),
  message: z
    .string()
    .min(1, "El mensaje es obligatorio.")
    .min(10, "El mensaje debe tener al menos 10 caracteres."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema as any) as Resolver<ContactFormValues>,
  });

  const onSubmit = async () => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success(
        "Mensaje enviado correctamente. Te contactaremos a la brevedad."
      );
      reset();
    } catch {
      toast.error("Hubo un error. Intentá de nuevo.");
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Contactanos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tenés dudas o querés agendar una visita? Escribinos y te respondemos a la brevedad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MailIcon className="size-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <a
                  href="mailto:contacto@cabralinmobiliaria.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contacto@cabralinmobiliaria.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PhoneIcon className="size-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Teléfono</h3>
                <a
                  href="tel:+5491112345678"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +54 9 11 1234-5678
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPinIcon className="size-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Dirección</h3>
                <p className="text-muted-foreground">
                  Av. Corrientes 1234, CABA
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                className="mt-2"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="mt-2"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+54 9 11 1234-5678"
                className="mt-2"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="Contanos en qué podemos ayudarte..."
                rows={4}
                className="mt-2"
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

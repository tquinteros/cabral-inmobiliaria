"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Mensaje enviado correctamente. Te contactaremos a la brevedad.");
      form.reset();
    } catch {
      toast.error("Hubo un error. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre"
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+54 9 11 1234-5678"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Contanos en qué podemos ayudarte..."
                rows={4}
                required
                className="mt-2"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

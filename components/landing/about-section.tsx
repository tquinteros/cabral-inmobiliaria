"use client";

import Image from "next/image";
import {
  UserRound,
  Building2,
  Award,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string }[] = [
  { icon: UserRound, title: "Atención personalizada" },
  { icon: Building2, title: "Amplio portfolio de propiedades" },
  { icon: Award, title: "Asesoramiento profesional" },
];

export function AboutSection() {
  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image - modern frame with offset */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
              <Image
                src="/about-us.jpg"
                alt="Cabral Inmobiliaria - Tu hogar ideal"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Sobre nosotros
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4">
                Encontrá el hogar que buscás
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                En Cabral Inmobiliaria nos especializamos en ayudarte a encontrar
                el hogar ideal. Con años de experiencia en el mercado, conocemos
                cada rincón de la ciudad y trabajamos para ofrecerte las mejores
                opciones en venta y alquiler.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Nuestro compromiso es brindarte un servicio personalizado,
                transparente y cercano. Ya sea que busques una casa con jardín,
                un departamento en el centro o un terreno para construir,
                estamos para acompañarte en cada paso.
              </p>
            </div>

            {/* Feature cards with icons */}
            <div className="grid sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-medium">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

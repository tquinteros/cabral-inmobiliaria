"use client";

import Image from "next/image";

export function AboutSection() {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="Cabral Inmobiliaria"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Sobre nosotros
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              En Cabral Inmobiliaria nos especializamos en ayudarte a encontrar el hogar
              ideal. Con años de experiencia en el mercado, conocemos cada rincón de la
              ciudad y trabajamos para ofrecerte las mejores opciones en venta y alquiler.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Nuestro compromiso es brindarte un servicio personalizado, transparente y
              cercano. Ya sea que busques una casa con jardín, un departamento en el
              centro o un terreno para construir, estamos para acompañarte en cada paso.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Atención personalizada
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Amplio portfolio de propiedades
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Asesoramiento profesional
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SearchFilters } from "./search-filters";

export function HeroSection() {
  const [height, setHeight] = useState<string>("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const header = document.getElementById("site-header");
      if (header) {
        const headerHeight = header.getBoundingClientRect().height;
        setHeight(`calc(100vh - ${headerHeight}px)`);
      } else {
        setHeight("100vh");
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const header = document.getElementById("site-header");
    if (header) resizeObserver.observe(header);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
      style={{ minHeight: height, height }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, oklch(0.98 0.01 90 / 0.7), oklch(0.98 0.01 90 / 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80')",
        }}
      />
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Encontrá tu próximo hogar
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Casas, departamentos y terrenos en venta y alquiler. Tu propiedad ideal
          está a un clic de distancia.
        </p>
        <SearchFilters />
      </div>
    </section>
  );
}

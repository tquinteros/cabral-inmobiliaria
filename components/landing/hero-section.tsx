"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "./search-filters";

function HeroShell({ children }: { children: ReactNode }) {
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
          backgroundImage: "url('/hero.jpg')",
        }}
      />
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Encontrá tu próximo hogar
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Casas, departamentos y terrenos en venta y alquiler. Tu propiedad ideal
          está a un clic de distancia.
        </p>
        {children}
      </div>
    </section>
  );
}

export function HeroSection() {
  return (
    <HeroShell>
      <SearchFilters />
    </HeroShell>
  );
}

export function HeroSectionFallback() {
  return (
    <HeroShell>
      <div className="flex flex-wrap items-end gap-3 sm:gap-4 p-4 sm:p-6 bg-background/80 backdrop-blur-sm rounded-xl border shadow-lg">
        <Tabs value="sell" className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="sell">Venta</TabsTrigger>
            <TabsTrigger value="rent">Alquiler</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 min-w-[160px]">
          <Button
            variant="outline"
            className="w-full justify-between font-normal h-9 px-3 py-2"
            disabled
          >
            Tipo de propiedad
          </Button>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Button
            variant="outline"
            className="w-full justify-between font-normal h-9 px-3 py-2"
            disabled
          >
            Ubicación
          </Button>
        </div>

        <Button size="md" className="gap-2" disabled>
          <SearchIcon className="size-4" />
          Buscar
        </Button>
      </div>
    </HeroShell>
  );
}

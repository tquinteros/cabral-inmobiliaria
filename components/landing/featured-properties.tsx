"use client";

import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FeaturedProperties() {
  const { data, isLoading, isError } = useProperties({
    limit: 8,
    orderBy: "price",
    order: "asc",
  });

  const properties = data?.properties ?? [];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Propiedades destacadas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Una selección de las mejores opciones para vos. Encontrá la propiedad que
            se adapte a tus necesidades.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-muted-foreground">
            No pudimos cargar las propiedades. Intentá de nuevo más tarde.
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay propiedades disponibles en este momento.
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {properties.map((property) => (
                <CarouselItem
                  key={property.id}
                  className="pl-2 md:pl-4 basis-full lg:basis-[calc((100%-2.5rem)/3.5)]"
                >
                  <PropertyCard property={property} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-12" />
            <CarouselNext className="hidden lg:flex -right-12" />
          </Carousel>
        )}
      </div>
    </section>
  );
}

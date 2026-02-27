"use client";

import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";
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
      <div className="container mx-auto">
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
          <Carousel
            opts={{ align: "start", slidesToScroll: 1 }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="flex min-w-0 pl-2 md:pl-4 basis-full md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
                >
                  <PropertyCardSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-12" />
            <CarouselNext className="hidden lg:flex -right-12" />
          </Carousel>
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
                  className="flex min-w-0 pl-2 md:pl-4 basis-full md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
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

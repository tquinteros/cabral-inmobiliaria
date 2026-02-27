"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { BedIcon, BathIcon, SquareIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyAmenities } from "@/components/properties/property-amenities";
import { getPropertyById } from "@/lib/actions/properties";

const PropertyMap = dynamic(
  () =>
    import("@/components/properties/property-map").then((mod) => ({
      default: mod.PropertyMap,
    })),
  { ssr: false, loading: () => <div className="rounded-xl h-[320px] bg-muted animate-pulse" /> }
);

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const idNum = parseInt(id, 10);
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi | null>(null);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(idNum),
    enabled: !!id && !isNaN(idNum),
  });


  if (isLoading || !property) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse bg-muted rounded-xl aspect-video mb-8" />
          <div className="h-8 bg-muted rounded w-2/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </main>
    );
  }

  const imageUrl =
    property.cover_picture?.url ??
    property.cover_picture?.thumb ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80";

  const photos = property.photos && property.photos.length > 0
    ? property.photos
    : undefined;

  return (
    <main className="min-h-screen">
        <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/propiedades" className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Volver a propiedades
            </Link>
          </Button>

          {photos ? (
            <div className="mb-8 space-y-4">
              <Carousel className="w-full" setApi={setMainCarouselApi}>
                <CarouselContent className="ml-0">
                  {photos.map((photo, index) => {
                    const src =
                      photo.image ??
                      photo.original ??
                      photo.thumb ??
                      imageUrl;

                    return (
                      <CarouselItem key={index} className="pl-0">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                          <Image
                            src={src}
                            alt={property.type?.name ?? "Propiedad"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 896px) 100vw, 896px"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex left-4 sm:left-4" />
                <CarouselNext className="hidden sm:flex right-4 sm:right-4" />
              </Carousel>

              {/* Thumbnails carousel */}
              <Carousel
                className="w-full"
                opts={{ align: "start", slidesToScroll: 3 }}
              >
                <CarouselContent className="-ml-2">
                  {photos.map((photo, index) => {
                    const thumbSrc =
                      photo.thumb ??
                      photo.image ??
                      photo.original ??
                      imageUrl;

                    return (
                      <CarouselItem
                        key={index}
                        className="pl-2 basis-1/4 sm:basis-1/6 lg:basis-1/8"
                      >
                        <button
                          type="button"
                          onClick={() => mainCarouselApi?.scrollTo(index)}
                          className="relative w-full pb-[70%] rounded-lg overflow-hidden border border-transparent hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Image
                            src={thumbSrc}
                            alt={property.type?.name ?? "Propiedad"}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        </button>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-8">
              <Image
                src={imageUrl}
                alt={property.type?.name ?? "Propiedad"}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {property.type?.name ?? "Propiedad"} en{" "}
            {property.location?.short_location ?? "—"}
          </h1>
          {/* <p className="text-muted-foreground mb-6">
            {property.reference_code && `Código: ${property.reference_code}`}
          </p> */}

          <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
            {property.room_amount != null && property.room_amount > 0 && (
              <span className="flex items-center gap-2">
                <BedIcon className="size-5" />
                {property.room_amount} ambientes
              </span>
            )}
            {property.bathroom_amount != null && property.bathroom_amount > 0 && (
              <span className="flex items-center gap-2">
                <BathIcon className="size-5" />
                {property.bathroom_amount} baños
              </span>
            )}
            {(property.surface ?? property.roofed_surface) != null &&
              (property.surface ?? property.roofed_surface)! > 0 && (
                <span className="flex items-center gap-2">
                  <SquareIcon className="size-5" />
                  {property.surface ?? property.roofed_surface} m²
                </span>
              )}
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <PropertyAmenities amenities={property.amenities} className="mb-6" />
          )}

          <p className="text-2xl font-semibold text-primary mb-6">
            {property.web_price ?? "Consultar precio"}
          </p>

          {(property.rich_description || property.description) && (
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              {property.rich_description ? (
                <div
                  className="text-muted-foreground prose-sm sm:prose-base"
                  dangerouslySetInnerHTML={{ __html: property.rich_description }}
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {property.description}
                </p>
              )}
            </div>
          )}

          {property.geo_lat && property.geo_long && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
              <PropertyMap
                lat={property.geo_lat}
                long={property.geo_long}
                title={property.location?.short_location ?? property.type?.name ?? "Propiedad"}
              />
            </div>
          )}

          <Button asChild size="lg" className="mt-8">
            <Link href="mailto:contacto@cabralinmobiliaria.com?subject=Consulta%20propiedad%20REF">
              Consultar por esta propiedad
            </Link>
          </Button>
        </div>
        </div>
      </main>
  );
}

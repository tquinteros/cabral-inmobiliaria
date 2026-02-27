"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { BedIcon, BathIcon, SquareIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyAmenities } from "@/components/properties/property-amenities";
import { getPropertyById } from "@/lib/actions/properties";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const idNum = parseInt(id, 10);

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

          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {property.type?.name ?? "Propiedad"} en{" "}
            {property.location?.short_location ?? "—"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {property.reference_code && `Código: ${property.reference_code}`}
          </p>

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

          {property.description && (
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {property.description}
              </p>
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

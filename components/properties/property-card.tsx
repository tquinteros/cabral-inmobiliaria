"use client";

import Image from "next/image";
import Link from "next/link";
import { BedIcon, BathIcon, SquareIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PropertyAmenities } from "./property-amenities";
import type { TokkoProperty } from "@/types/property";

interface PropertyCardProps {
  property: TokkoProperty;
  className?: string;
}

function formatPrice(price?: string, operations?: string[]) {
  if (price && price !== "Consultar" && !price.toLowerCase().includes("consultar")) {
    return price;
  }
  return "Consultar precio";
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const imageUrl =
    property.cover_picture?.url ??
    property.cover_picture?.thumb ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  const operation = property.available_operations?.[0];
  const isRent = operation?.toLowerCase().includes("rent") ?? false;

  return (
    <Card className={cn("flex h-full min-w-0 flex-col overflow-hidden group hover:shadow-lg transition-shadow pt-0 w-full", className)}>
      <CardHeader className="shrink-0 p-0">
        <Link href={`/propiedades/${property.id}`} className="relative aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={property.type?.name ?? "Propiedad"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {isRent ? "Alquiler" : "Venta"}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-lg line-clamp-2 wrap-break-word">
            {property.publication_title ??
              `${property.type?.name ?? "Propiedad"} en ${property.location?.short_location ?? "—"}`}
          </h3>
          <p className="line-clamp-2 wrap-break-word text-sm text-muted-foreground">
            {property.location?.short_location ?? "Sin ubicación"}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap gap-4 text-sm text-muted-foreground">
          {property.room_amount != null && property.room_amount > 0 && (
            <span className="flex items-center gap-1">
              <BedIcon className="size-4" />
              {property.room_amount} amb.
            </span>
          )}
          {property.bathroom_amount != null && property.bathroom_amount > 0 && (
            <span className="flex items-center gap-1">
              <BathIcon className="size-4" />
              {property.bathroom_amount} baños
            </span>
          )}
          {(property.surface ?? property.roofed_surface) != null &&
            (property.surface ?? property.roofed_surface)! > 0 && (
              <span className="flex items-center gap-1">
                <SquareIcon className="size-4" />
                {property.surface ?? property.roofed_surface} m²
              </span>
            )}
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <PropertyAmenities amenities={property.amenities} className="min-w-0" />
        )}

        <p className="mt-auto wrap-break-word font-semibold text-primary">
          {formatPrice(property.web_price, property.available_operations)}
        </p>
      </CardContent>
      <CardFooter className="mt-auto shrink-0 p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/propiedades/${property.id}`}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("flex h-full min-w-0 flex-col overflow-hidden pt-0 w-full", className)}>
      <CardHeader className="shrink-0 p-0">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
          <div className="absolute top-3 left-3">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-4">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex min-w-0 flex-wrap gap-4 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <Skeleton className="mt-auto h-5 w-24" />
      </CardContent>
      <CardFooter className="mt-auto shrink-0 p-4 pt-0">
        <Button variant="outline" className="w-full" disabled>
          Ver Más
        </Button>
      </CardFooter>
    </Card>
  );
}
